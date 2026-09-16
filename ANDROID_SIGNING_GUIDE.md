# 🔑 Indian Short Films — Android App Release Signing Guide

This document explains how to configure a production Android Signing Key (`.jks` / `.keystore`) for building a signed release APK and Android App Bundle (`.aab`) for Google Play Store submission.

---

## 1. Status

* **Status:** `BLOCKED — Production release keystore & signing configuration required`

---

## 2. Generating a Production Upload Keystore

Run the following command on a secure development machine to generate a new Java Keystore:

```bash
keytool -genkey -v -keystore release-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

> ⚠️ **IMPORTANT SECURITY DIRECTIVE:**  
> Store `release-upload-key.jks` and its passwords in a secure password manager. **Never commit `.jks` files or passwords to Git.**

---

## 3. Configuring `key.properties`

Create a file at `apps/mobile/android/key.properties`:

```properties
storePassword=<YOUR_STORE_PASSWORD>
keyPassword=<YOUR_KEY_PASSWORD>
keyAlias=upload
storeFile=release-upload-key.jks
```

Ensure `key.properties` is listed in `apps/mobile/.gitignore`.

---

## 4. Configuring `apps/mobile/android/app/build.gradle`

Update `android/app/build.gradle` to load `key.properties`:

```groovy
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 5. Building Signed Release Artifacts

Once configured:

```bash
cd apps/mobile
flutter build apk --release
flutter build appbundle --release
```

Outputs will be generated at:
- **APK:** `apps/mobile/build/app/outputs/flutter-apk/app-release.apk`
- **AAB:** `apps/mobile/build/app/outputs/bundle/release/app-release.aab`
