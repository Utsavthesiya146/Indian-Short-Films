# Website to App Audit (Indian Short Films)

## 1. Existing Architecture
The project follows a monolithic PHP + MySQL architecture with client-side Vanilla JavaScript for dynamic rendering of grids and models, and Tailwind CSS (via CDN) alongside custom CSS (`style.css`) for styling. The backend acts as the single source of truth.

## 2. Frontend Files
- **HTML/PHP Pages**: `index.php` (Home), `discover.php`, `about.php`, `contact.php`, `filmmakers.php`, `gallery.php`, `profile.php`, `watchlist.php`.
- **Partials**: `includes/header.php`, `includes/navbar.php`, `includes/footer.php`.
- **CSS**: `css/style.css` (custom flex/grid and media queries) + Tailwind CDN.
- **JavaScript**: `js/script.js` (handles API fetching, component rendering, modal handling, video playback, and watchlist local storage).

## 3. Backend PHP Files
Located in `php/`:
- **Auth**: `api_login.php`, `api_register.php`, `api_check_session.php`, `logout.php`.
- **Data Fetching**: `api_get_films.php`, `api_get_watchlist.php`, `api_get_users.php`, `api_get_stats.php`.
- **Mutations**: `api_add_watchlist.php`, `api_toggle_like.php`, `api_submit_review.php`, `api_submit_film.php`, `api_update_profile.php`.

## 4. Database Usage
- Configured via `php/db.php` connecting to a MySQL database.
- Key tables utilized include `users`, `films`, `film_submissions`, `watchlists`, `film_likes`, and `reviews`.
- Used natively by the existing PHP frontend.

## 5. Authentication Mechanism
- PHP Sessions (`session_start()`) are established and checked on page load (`$_SESSION['user_id']`).
- `PHPSESSID` cookies are exchanged.
- State is hydrated directly in `includes/header.php` and via AJAX to `api_check_session.php`.
- Session continuity in Capacitor will rely strictly on persistent cookies.

## 6. Film/Video Data Flow
- Videos and films are managed through the admin panel/filmmaker submission form.
- The `DEFAULT_FILMS` array in `script.js` acts as a placeholder, but is dynamically overwritten by `php/api_get_films.php` on DOM load (`fetchFilmsFromDB()`).
- Data flows from MySQL -> PHP JSON -> JS Array -> DOM rendering.

## 7. Image/Video URLs
- Some are absolute (e.g., Unsplash, Google Storage for demos).
- User uploads are relative (`uploads/videos/...`). `script.js` dynamically prefixes relative URLs with `./` or `../` depending on the current route.
- In Capacitor loading `https://indianshortmovies.com/`, all relative paths will resolve cleanly against the production origin.

## 8. Existing Mobile Responsiveness
- `css/style.css` implements `@media (max-width: 768px)` and `@media (max-width: 640px)`.
- Features like a bottom navigation bar, off-canvas mobile sidebar (`mobile-admin-bar`), modal stacking, and 2-column film grids are already implemented for smaller screens.
- **Verdict**: Very responsive. Minimal fixes required for the mobile shell.

## 9. Existing Forms
- Sign In, Sign Up, and Add/Submit Film forms are contained within CSS modals (`#signin-modal`, `#submit-film-modal`).
- File uploads exist for Film Submission (`api_submit_film.php`).

## 10. Existing JavaScript Functionality
- `script.js` handles modal triggers via ESC key, dynamic list re-rendering, local storage caching for watchlist UI (`ism_watchlist`), and basic HTML5 `<video>` control.

## 11. Existing Security Mechanisms
- Prepared statements used in `db.php` queries.
- PHP Session IDs used for auth verification.
- Passwords likely hashed in DB.
- **App impact**: Capacitor must not bypass or re-implement this; it must securely leverage it via the webview.

## 12. Capacitor Conversion Plan
1. **Initialize Project**: Create a new `mobile_capacitor` directory. Install `@capacitor/core` and `@capacitor/cli`.
2. **Configure Wrapper**: Point `capacitor.config.ts` to `https://indianshortmovies.com/`.
3. **Add Native Plugins**: 
   - `@capacitor/app` (Back button)
   - `@capacitor/splash-screen` (Loading UX)
   - `@capacitor/status-bar` (UI polishing)
   - `@capacitor/network` (Offline detection)
4. **Local Shell App**: A local `index.html` to act as an offline-fallback/bootloader that redirects to the remote site, or purely relying on `server.url` configuration.
5. **Assets**: Add app icon and splash screens.
6. **Build & Release**: Sync Android/iOS, build unsigned/signed AAB.

## 13. Potential Play Store Issues
- If the app appears to be a "100% web wrapper" without native UX enhancements (App Store/Play Store rejection for "WebView Spam"). Mitigation: Implement Splash Screen, Back Button intercept, and Offline error screen.
- Media permissions requirement if `<input type="file" accept="video/*">` triggers camera/file picker. Mitigation: Declare appropriate Android permissions in Manifest.

## 14. Potential App Store Issues
- Apple is notoriously strict on "Minimum Functionality" (Guideline 4.2). Wrappers are often rejected if they don't use iOS features.
- Mitigation: Using native Video playback handling (which iOS WebView does automatically), Native Safe Area handling, and potentially Push Notifications later.
