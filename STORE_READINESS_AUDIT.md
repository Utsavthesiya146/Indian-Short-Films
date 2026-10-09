# Store Readiness Audit (Indian Short Films)

## Overview
This document evaluates the Indian Short Films Capacitor application against Google Play Store and Apple App Store guidelines, specifically addressing the common "Minimum Functionality" rejections faced by web wrappers.

## 1. Google Play Store Readiness (Status: READY)

### Addressed Potential Rejections:
- **Spam / Webview Spam (Policy 3.3)**: Play Store rejects apps whose primary purpose is to drive affiliate traffic to a website or merely wrap a URL without adding value.
  - **Our Solution**: We integrated native Android Lifecycle routing. The application intercepts the physical hardware back button, manipulating the WebView's history stack to provide a native navigational feel. Additionally, we use a Native Splash Screen to hide web loading flashes.
- **Permissions Context (Policy 4.1)**: Requesting broad permissions without context.
  - **Our Solution**: We have strictly defined only required capabilities (`READ_EXTERNAL_STORAGE`, `READ_MEDIA_VIDEO`) to allow users to upload their short films directly from the Android native file picker. 

### Action Items for Publish:
- Provide a clear Privacy Policy URL.
- Use the generated `.aab` (`app-release.aab`) to sign and submit to Google Play Console.

## 2. Apple App Store Readiness (Status: READY / ACTION REQUIRED)

### Addressed Potential Rejections:
- **Minimum Functionality (Guideline 4.2)**: "Your app should include features, content, and UI that elevate it beyond a repackaged website."
  - **Our Solution**: We utilized `@capacitor/status-bar` to map the app perfectly into the iOS Safe Area, creating a seamless, bezel-to-bezel OTT cinematic experience. The iOS swipe-back gesture natively integrates with Capacitor's routing.
- **Push Notifications (Guideline 4.5)** (Optional but recommended):
  - *Recommendation*: While the app passes the core functionality check by integrating native video playback (HTML5 video automatically uses iOS's native fullscreen QuickTime player), integrating `@capacitor/push-notifications` in the future for "New Film Releases" will definitively cement its status as a native app to reviewers.

### Action Items for Publish:
- Open the `ios/` folder in Xcode.
- Ensure the `Deployment Target` is set to iOS 14.0 or higher.
- Sign the app with an Apple Developer Account.
- Ensure the app explicitly lists "Video Streaming" in its capabilities to justify the high-bandwidth requirements.

## Summary of Integrated Native Features:
1. **Native Splash Screen** (`@capacitor/splash-screen`)
2. **Hardware App Routing** (`@capacitor/app`)
3. **Immersive Status Bar** (`@capacitor/status-bar`)
4. **Native File Selection Mapping** (via AndroidManifest capabilities)

**Conclusion**: The app is robustly configured to pass as a high-quality OTT media application rather than a simple web shortcut.
