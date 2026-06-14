import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';
import '../models/api_service.dart';

// ---------------------------------------------------------------------------
// Android notification channel definition
// ---------------------------------------------------------------------------
const AndroidNotificationChannel _kAlertChannel = AndroidNotificationChannel(
  'ews_alerts_channel',
  'EWS Alerts',
  description: 'Notifikasi peringatan dini banjir (Early Warning System)',
  importance: Importance.max,
  playSound: true,
  enableVibration: true,
  showBadge: true,
);

// ---------------------------------------------------------------------------
// Top-level background message handler
// Harus top-level (bukan method class) agar bisa dipanggil oleh isolate terpisah
// ---------------------------------------------------------------------------
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Pada background handler, tidak perlu re-initialize Firebase
  // (sudah dilakukan oleh plugin secara otomatis).
  // Cukup tampilkan local notification.
  final FlutterLocalNotificationsPlugin fln = FlutterLocalNotificationsPlugin();
  const AndroidInitializationSettings initAndroid =
      AndroidInitializationSettings('@mipmap/ic_launcher');
  const InitializationSettings initSettings =
      InitializationSettings(android: initAndroid);
  await fln.initialize(initSettings);

  // Buat channel (jika belum ada)
  await fln
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(_kAlertChannel);

  final notification = message.notification;
  if (notification != null) {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'ews_alerts_channel',
      'EWS Alerts',
      channelDescription: 'Notifikasi peringatan dini banjir',
      importance: Importance.max,
      priority: Priority.high,
      playSound: true,
      enableVibration: true,
      icon: '@mipmap/ic_launcher',
    );
    const NotificationDetails platformDetails =
        NotificationDetails(android: androidDetails);
    await fln.show(
      notification.hashCode,
      notification.title,
      notification.body,
      platformDetails,
      payload: message.data['alertId'] ?? '',
    );
  }
}

// ---------------------------------------------------------------------------
// NotificationService Singleton
// ---------------------------------------------------------------------------
class NotificationService {
  NotificationService._internal();
  static final NotificationService instance = NotificationService._internal();

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _flutterLocal =
      FlutterLocalNotificationsPlugin();

  // Stream untuk UI yang ingin bereaksi terhadap pesan masuk
  final StreamController<RemoteMessage> _onMessageController =
      StreamController.broadcast();
  Stream<RemoteMessage> get onMessageStream => _onMessageController.stream;

  // Stream untuk navigasi saat notifikasi di-tap
  final StreamController<String?> _onTapController =
      StreamController.broadcast();
  Stream<String?> get onNotificationTap => _onTapController.stream;

  bool _initialized = false;
  GlobalKey<NavigatorState>? _navigatorKey;
  String? _cachedToken;
  String? _defaultTargetArea;

  // ---------------------------------------------------------------------------
  // init() — dipanggil dari main.dart setelah Firebase.initializeApp()
  // ---------------------------------------------------------------------------
  Future<void> init({
    String? targetArea,
    GlobalKey<NavigatorState>? navigatorKey,
  }) async {
    if (_initialized) return;
    _navigatorKey = navigatorKey;

    // 1. Register background handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // 2. Setup local notification plugin
    const AndroidInitializationSettings initAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings initDarwin =
        DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    const InitializationSettings initSettings = InitializationSettings(
      android: initAndroid,
      iOS: initDarwin,
    );

    await _flutterLocal.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onLocalNotifTapped,
    );

    // 3. Buat Android channel dengan importance MAX
    await _flutterLocal
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_kAlertChannel);

    // 4. Request permission
    await _requestPermission();

    // 5. Simpan targetArea dan hanya ambil token (TIDAK daftarkan ke backend dulu)
    // Token akan didaftarkan setelah user login via registerTokenForUser()
    _defaultTargetArea = targetArea;
    try {
      _cachedToken = await _messaging.getToken();
      if (kDebugMode) debugPrint('[NotificationService] FCM token cached: $_cachedToken');
    } catch (e) {
      if (kDebugMode) debugPrint('[NotificationService] getToken error: $e');
    }

    // 6. Listen token refresh — simpan token terbaru
    _messaging.onTokenRefresh.listen((newToken) async {
      if (kDebugMode) debugPrint('[NotificationService] Token refreshed: $newToken');
      _cachedToken = newToken;
      // Coba daftarkan ulang jika sudah pernah login
      try {
        await ApiService().subscribePushToken(
          token: newToken,
          targetArea: _defaultTargetArea,
        );
      } catch (e) {
        // Tidak apa-apa jika gagal (belum login) — akan coba ulang saat login
        if (kDebugMode) debugPrint('[NotificationService] Token refresh re-register skipped: $e');
      }
    });

    // 7. Foreground message handler
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // 8. App opened from background notification tap
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // 9. App opened from terminated state via notification tap
    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      // Delay sedikit agar navigator sudah siap
      Future.delayed(const Duration(milliseconds: 500), () {
        _handleNotificationTap(initialMessage);
      });
    }

    _initialized = true;
    if (kDebugMode) debugPrint('[NotificationService] Initialized successfully.');
  }

  // ---------------------------------------------------------------------------
  // registerTokenForUser() — dipanggil dari AuthService setelah login berhasil
  // ---------------------------------------------------------------------------
  Future<void> registerTokenForUser({String? targetArea}) async {
    final token = _cachedToken ?? await _messaging.getToken().catchError((_) => null);
    if (token == null) {
      if (kDebugMode) debugPrint('[NotificationService] No FCM token available to register.');
      return;
    }
    _cachedToken = token;
    try {
      await ApiService().subscribePushToken(
        token: token,
        targetArea: targetArea ?? _defaultTargetArea,
      );
      if (kDebugMode) debugPrint('[NotificationService] FCM token registered to backend after login.');
    } catch (e) {
      if (kDebugMode) debugPrint('[NotificationService] Failed to register token after login: $e');
    }
  }

  // ---------------------------------------------------------------------------
  // Request notification permission
  // ---------------------------------------------------------------------------
  Future<void> _requestPermission() async {
    // Android 13+ (API 33+)
    if (Platform.isAndroid) {
      final status = await Permission.notification.status;
      if (!status.isGranted) {
        await Permission.notification.request();
      }
    }

    // iOS / macOS
    if (Platform.isIOS || Platform.isMacOS) {
      try {
        await _messaging.requestPermission(
          alert: true,
          badge: true,
          sound: true,
          provisional: false,
        );
      } catch (e) {
        if (kDebugMode) {
          debugPrint('[NotificationService] requestPermission skipped: $e');
        }
      }
    }
  }




  // ---------------------------------------------------------------------------
  // Foreground message → tampilkan local notification
  // ---------------------------------------------------------------------------
  Future<void> _handleForegroundMessage(RemoteMessage message) async {
    if (kDebugMode) {
      debugPrint('[NotificationService] Foreground message: ${message.notification?.title}');
    }

    final notification = message.notification;
    if (notification != null) {
      const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
        'ews_alerts_channel',
        'EWS Alerts',
        channelDescription: 'Notifikasi peringatan dini banjir',
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
        enableVibration: true,
        icon: '@mipmap/ic_launcher',
      );
      const NotificationDetails platformDetails =
          NotificationDetails(android: androidDetails);

      await _flutterLocal.show(
        notification.hashCode,
        notification.title,
        notification.body,
        platformDetails,
        payload: message.data['alertId'] ?? '',
      );
    }

    // Emit ke stream agar UI bisa refresh
    _onMessageController.add(message);
  }

  // ---------------------------------------------------------------------------
  // Notification tap handler (background → foreground & cold start)
  // ---------------------------------------------------------------------------
  void _handleNotificationTap(RemoteMessage message) {
    if (kDebugMode) {
      debugPrint('[NotificationService] Notification tapped. data: ${message.data}');
    }

    final alertId = message.data['alertId'] as String?;
    _onTapController.add(alertId);

    // Navigate to notification tab
    _navigatorKey?.currentState?.pushNamed('/home');
  }

  // ---------------------------------------------------------------------------
  // Local notification tap handler
  // ---------------------------------------------------------------------------
  void _onLocalNotifTapped(NotificationResponse response) {
    if (kDebugMode) {
      debugPrint('[NotificationService] Local notif tapped. payload: ${response.payload}');
    }

    _onTapController.add(response.payload);
    _navigatorKey?.currentState?.pushNamed('/home');
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------
  void dispose() {
    _onMessageController.close();
    _onTapController.close();
  }
}
