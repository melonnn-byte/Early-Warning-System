import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/foundation.dart';

class SseEvent {
  final String? id;
  final String? event;
  final String data;

  SseEvent({this.id, this.event, required this.data});

  @override
  String toString() => 'SseEvent(id: $id, event: $event, data: $data)';
}

class SseClient {
  final String url;
  final Map<String, String>? headers;

  StreamController<SseEvent>? _controller;
  HttpClient? _client;
  bool _isConnecting = false;
  bool _shouldReconnect = true;
  Timer? _reconnectTimer;

  // Exponential backoff config
  int _retryCount = 0;
  static const int _maxRetryCount = 8;
  static const Duration _baseDelay = Duration(seconds: 5);
  static const Duration _maxDelay = Duration(seconds: 60);

  // Minimum time a connection must be alive before resetting retry count
  static const Duration _stableConnectionThreshold = Duration(seconds: 30);
  DateTime? _connectedAt;

  Stream<SseEvent> get stream {
    _controller ??= StreamController<SseEvent>.broadcast(
      onListen: _start,
      onCancel: _stop,
    );
    return _controller!.stream;
  }

  SseClient(this.url, {this.headers});

  void _start() {
    _shouldReconnect = true;
    _retryCount = 0;
    _connect();
  }

  void _stop() {
    _shouldReconnect = false;
    _reconnectTimer?.cancel();
    _reconnectTimer = null;
    _client?.close(force: true);
    _client = null;
    _controller?.close();
    _controller = null;
    _isConnecting = false;
  }

  // Hitung delay dengan exponential backoff + jitter
  Duration _nextDelay() {
    final exponential = _baseDelay * pow(2, _retryCount.clamp(0, _maxRetryCount));
    final capped = exponential > _maxDelay ? _maxDelay : exponential;
    // Tambah jitter ±20% agar tidak semua client reconnect bersamaan
    final jitter = (Random().nextDouble() * 0.4 - 0.2) * capped.inMilliseconds;
    final ms = (capped.inMilliseconds + jitter).clamp(
      _baseDelay.inMilliseconds.toDouble(),
      _maxDelay.inMilliseconds.toDouble(),
    );
    return Duration(milliseconds: ms.round());
  }

  Future<void> _connect() async {
    if (_isConnecting || !_shouldReconnect) return;
    _isConnecting = true;

    try {
      _client?.close(force: true);
      _client = HttpClient()
        ..connectionTimeout = const Duration(seconds: 15)
        ..idleTimeout = const Duration(seconds: 120);

      final request = await _client!.getUrl(Uri.parse(url));
      headers?.forEach((key, value) {
        request.headers.set(key, value);
      });
      request.headers.set('Accept', 'text/event-stream');
      request.headers.set('Cache-Control', 'no-cache');
      request.headers.set('Connection', 'keep-alive');

      final response = await request.close();
      _isConnecting = false;

      if (response.statusCode == 200) {
        _connectedAt = DateTime.now();
        if (kDebugMode) debugPrint('⚡ [SSE] Connected to $url');

        String? currentId;
        String? currentEvent;
        final buffer = StringBuffer();

        try {
          await for (final chunk
              in response.transform(utf8.decoder).transform(const LineSplitter())) {
            if (!_shouldReconnect) break;

            final line = chunk.trim();
            if (line.isEmpty) {
              if (buffer.isNotEmpty) {
                _controller?.add(SseEvent(
                  id: currentId,
                  event: currentEvent,
                  data: buffer.toString(),
                ));
                buffer.clear();
                currentEvent = null;
              }
              continue;
            }

            if (line.startsWith('id:')) {
              currentId = line.substring(3).trim();
            } else if (line.startsWith('event:')) {
              currentEvent = line.substring(6).trim();
            } else if (line.startsWith('data:')) {
              buffer.write(line.substring(5).trim());
            }
          }
        } catch (streamError) {
          if (kDebugMode) debugPrint('❌ [SSE] Stream error: $streamError');
        }

        // Koneksi selesai (normal timeout dari server) — reset retry jika koneksi stabil
        if (_connectedAt != null) {
          final uptime = DateTime.now().difference(_connectedAt!);
          if (uptime >= _stableConnectionThreshold) {
            _retryCount = 0; // reset karena koneksi cukup lama
          }
        }
      } else {
        throw HttpException('Server returned status ${response.statusCode}');
      }
    } catch (e) {
      _isConnecting = false;
      if (kDebugMode) debugPrint('❌ [SSE] Error ($url): $e');
    }

    // Reconnect dengan backoff jika masih diperlukan
    if (_shouldReconnect) {
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    if (!_shouldReconnect) return;
    _reconnectTimer?.cancel();

    final delay = _nextDelay();
    _retryCount = (_retryCount + 1).clamp(0, _maxRetryCount);

    if (kDebugMode) {
      debugPrint('🔄 [SSE] Reconnecting in ${delay.inSeconds}s (attempt #$_retryCount)...');
    }

    _reconnectTimer = Timer(delay, () {
      if (_shouldReconnect && !_isConnecting) {
        _connect();
      }
    });
  }

  void close() {
    _stop();
  }
}
