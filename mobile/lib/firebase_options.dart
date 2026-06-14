import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  // Web config — isi dari Firebase Console jika dibutuhkan
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyAbTrWQwwc-S2pQmDlz-oAQqJWXayR8VtA',
    appId: '1:235513471209:web:YOUR_WEB_APP_ID',
    messagingSenderId: '235513471209',
    projectId: 'ews-aplication',
    authDomain: 'ews-aplication.firebaseapp.com',
    storageBucket: 'ews-aplication.firebasestorage.app',
    measurementId: 'YOUR_MEASUREMENT_ID',
  );

  // Android config — dari google-services.json
  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyDNhNzUxmw5EfXZgOu025C81GxBy-pbsis',
    appId: '1:235513471209:android:edcf4b48d1f99aa1e79078',
    messagingSenderId: '235513471209',
    projectId: 'ews-aplication',
    storageBucket: 'ews-aplication.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAbTrWQwwc-S2pQmDlz-oAQqJWXayR8VtA',
    appId: '1:235513471209:ios:YOUR_IOS_APP_ID',
    messagingSenderId: '235513471209',
    projectId: 'ews-aplication',
    storageBucket: 'ews-aplication.firebasestorage.app',
    iosBundleId: 'com.ews.mobile',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyAbTrWQwwc-S2pQmDlz-oAQqJWXayR8VtA',
    appId: '1:235513471209:ios:YOUR_IOS_APP_ID',
    messagingSenderId: '235513471209',
    projectId: 'ews-aplication',
    storageBucket: 'ews-aplication.firebasestorage.app',
    iosBundleId: 'com.ews.mobile',
  );
}
