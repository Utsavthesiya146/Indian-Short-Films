# Capacitor Setup Guide (Indian Short Films)

## Why Capacitor instead of Flutter?
While a Flutter application was initially considered, building a robust cross-platform OTT streaming experience that stays perfectly synchronized with the existing PHP backend can become a maintenance bottleneck. By adopting Capacitor:
1. **Single Source of Truth**: The live PHP website (`https://indianshortmovies.com/`) serves as both the website and the mobile UI. Any update (new films, design changes, new categories) deployed to the website instantly appears on user devices without requiring App Store / Play Store updates.
2. **Native UX, Web Speed**: Capacitor wraps the responsive website in a native WebView, but injects JavaScript bridges allowing the app to control Native device APIs.
3. **No Duplicate Business Logic**: User authentication (via `$_SESSION`), permissions, and video processing rely 100% on the battle-tested PHP backend.

## How to Build the Mobile App

### Prerequisites
1. **Node.js & npm**: Install the latest Node.js LTS.
2. **Android Studio**: Installed with SDK 34+.
3. **Xcode**: (macOS only) installed for iOS builds.

### Developer Workflow
If you modify the web shell (`public/index.html`) or Capacitor Configuration (`capacitor.config.json`):

1. **Navigate to the Capacitor App**:
   ```bash
   cd apps/capacitor_app
   ```
2. **Sync Native Projects**:
   ```bash
   npx cap sync
   ```
   *This copies configuration and plugins into the native Android/iOS source trees.*
3. **Build Android**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ./gradlew bundleRelease
   ```
   *This produces the APK (for direct install/testing) and the AAB (for Google Play Console).*

## Native Plugin Integrations
- **SplashScreen (`@capacitor/splash-screen`)**: Configured to hold the native launch screen for 2000ms until the remote PHP website renders its DOM, preventing white flashes.
- **App/Back Button (`@capacitor/app`)**: We added an event listener directly in the PHP website (`includes/footer.php`) that checks if `window.Capacitor` exists. When a user presses the Android hardware back button, it routes the command through `window.history.back()`. If they are at the root history state, it cleanly calls `Capacitor.Plugins.App.exitApp()`.
- **Status Bar (`@capacitor/status-bar`)**: Automatically maps the HTML styling to the top status bar.
- **Permissions**: `android.permission.INTERNET`, `READ_EXTERNAL_STORAGE`, and `READ_MEDIA_VIDEO` are strictly defined in `android/app/src/main/AndroidManifest.xml` to ensure file uploads (e.g., filmmakers submitting films) map cleanly from `<input type="file">` to Android's native file picker.
