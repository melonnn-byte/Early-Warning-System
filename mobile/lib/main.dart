import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(const EWSFloodGuardApp());
}

class EWSFloodGuardApp extends StatelessWidget {
  const EWSFloodGuardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EWS Flood Guard',
      theme: AppTheme.theme,
      home: const SplashScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
