# 📱 Flutter Mobile Build & Release Guide

## Prerequisites
- Flutter SDK 3.0+
- Android Studio / Android SDK (API Level 29+)

## Running locally
```bash
cd apps/mobile
flutter pub get
flutter run
```

## Building Release APK
```bash
cd apps/mobile
flutter pub get
flutter build apk --release
```
The generated APK will be available at `apps/mobile/build/app/outputs/flutter-apk/app-release.apk`.
