# Capacitor Architecture Decision

## Decision: Option B - Remote Website Loading with Native Capacitor Enhancements

### Reasoning

After evaluating the existing architecture of the Indian Short Films project, the PHP website (`indianshortmovies.com`) is deeply intertwined with its frontend. Files like `index.php`, `discover.php`, `includes/header.php`, and `includes/navbar.php` utilize server-side rendering (SSR) for session management (`$_SESSION['user_id']`), dynamic routing, and dynamic data population before sending HTML to the client.

If we choose **Option A (Bundle Locally)**:
- We would have to manually translate all PHP views into static HTML files.
- We would have to build a completely new authentication state management system in JavaScript because the current system relies on PHP Session cookies (`PHPSESSID`) evaluated at the server before rendering the header.
- This would violate the core requirement: "Do NOT duplicate the existing PHP business logic" and "ONE website".
- Any future changes to the website UI would require manually syncing those changes into the mobile app repository and releasing an app update.

By choosing **Option B (Remote Loading)**:
- The mobile app will point its `server.url` in `capacitor.config.ts` directly to `https://indianshortmovies.com/`.
- This ensures 100% parity. It uses the exact same frontend, same backend, same authentication, and same videos. The website remains the absolute single source of truth.
- Content updates, UI changes, and new features added to the website will instantly reflect in the app without requiring an App Store/Play Store update.

### Preventing the "Useless URL Wrapper" Problem

To ensure the app meets the requirement of *not* being a basic WebView wrapper, we will deeply integrate Capacitor Native Plugins into the wrapper shell and inject native behavior:

1. **Native App Lifecycle & Hardware Back Button**: Use the `@capacitor/app` plugin to intercept Android's physical back button. If the user can go back in browser history, it will navigate back. If they are at the root, it will confirm exit or send them to the home tab, preventing accidental app closures.
2. **Splash Screen & App Icon**: Use `@capacitor/splash-screen` to hold a native splash screen while the remote website loads, hiding the white flash.
3. **Status Bar & Safe Area**: Use `@capacitor/status-bar` and CSS `env(safe-area-inset-top)` (if required) to integrate the remote webview under the notch cleanly.
4. **Network Resilience**: Use `@capacitor/network` to detect offline states and display a native or local HTML error screen instead of a raw Chrome/Safari "No Internet" dinosaur page.
5. **Session Continuity**: Ensure Capacitor's WebView is configured to persist Cookies accurately so the PHP Session behaves identically to a mobile browser.
6. **Video Playback & File Uploads**: Capacitor's WebView handles standard HTML5 video and `<input type="file">` natively, mapping directly to iOS/Android native file pickers and fullscreen video players.
