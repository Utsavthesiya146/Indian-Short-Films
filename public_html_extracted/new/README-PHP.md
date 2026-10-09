# Indian Short Movie - Pure PHP (PHP 8+) Web Application

Production-ready, responsive Indian Short Cinema & Filmmaker platform built with pure PHP 8+.

## Features Included
- **Pure PHP 8+ Architecture**: All pages are native `.php` files with clean server-side includes.
- **Includes Structure**:
  - `includes/header.php` - HTML `<head>`, meta tags, Google Fonts (`Outfit`, `Inter`, `Cinzel`), OpenGraph cards, CSS links.
  - `includes/navbar.php` - Brand logo SVG (ticket & "India's Stories on Screen"), links, search bar, Submit Film modal trigger, Admin button, mobile drawer menu.
  - `includes/sidebar.php` - Dedicated Admin Portal sidebar (Desktop pinned, Mobile slide drawer with backdrop).
  - `includes/footer.php` - Multi-column footer with required credit:
    `© 2026 Indian Short Films. All rights reserved. With love ❤️ HOSTING BABA`
    (Linking to https://webhostingbaba.com) + Video Player Modal, Submit Film Modal, and Sign In Modal.
- **Pages**:
  - `index.php` - Featured Hero premiere, Regional spotlight pills, Trending short films, 9:16 Vertical cinema reels, Filmmakers roster, CTA.
  - `discover.php` - Catalog with real-time language filter chips (Hindi, Kannada, Tamil, Malayalam, Telugu, Gujarati, Bengali, Marathi), search, duration badges, and video player.
  - `watchlist.php` - Saved films watchlist with localStorage persistence, remove action, and clear watchlist.
  - `filmmakers.php` - Independent Indian directors roster, awards, language badges, and film counts.
  - `about.php` - Brand story, cinematic mission, and distribution vision.
  - `contact.php` - Contact form, direct inquiry channels, and submission support.
  - `gallery.php` - Curated project gallery.
  - `admin/index.php` - Complete Admin Portal:
    - **Platform Analytics & Dashboard**
    - **Real-time overview of users, film uploads, submissions, and moderation**
    - 8 Stats Cards: Total Users (2), Total Short Films (20), Published Films (20), Pending Submissions (0), Total Video Views (45,890), Total Reviews (1), Filmmakers (18), Pending Reports (0).
    - Popular Indian Languages view share progress bars.
    - Recent Admin Activity audit log list.
    - Film Management catalog table with search & filters.
    - Submissions Queue.
    - Content Moderation Queue.
    - Add New Film publishing modal.

## How to Deploy

### 1. XAMPP / WAMP / MAMP (Local Testing)
1. Extract `indian-short-movie-php.zip` into your web root:
   - XAMPP: `C:/xampp/htdocs/indian-short-movie/`
   - MAMP: `/Applications/MAMP/htdocs/indian-short-movie/`
2. Start Apache from the XAMPP Control Panel.
3. Open your browser and navigate to:
   `http://localhost/indian-short-movie/`
4. Access the Admin Portal at:
   `http://localhost/indian-short-movie/admin/`

### 2. cPanel / Hostinger / Shared Hosting
1. Log into your cPanel or Hostinger hPanel.
2. Open **File Manager** and navigate to `public_html/`.
3. Upload `indian-short-movie-php.zip` and click **Extract**.
4. Make sure PHP version is set to **PHP 8.0, 8.1, 8.2, or 8.3+** in your hosting control panel.
5. Visit your domain name. All URLs, includes, stylesheets, and scripts work out of the box!
