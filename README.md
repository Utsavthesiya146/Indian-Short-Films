# 🎬 Indian Short Films Platform

> **Tagline:** *"Discover India. Watch Stories."*

A full production-ready OTT discovery & streaming platform dedicated to showcasing independent Indian short films across all regional languages (Hindi, Gujarati, Tamil, Telugu, Malayalam, Kannada, Marathi, Bengali, Punjabi, English, and more).

---

## 🏗️ Architecture & Monorepo Structure

```text
indian-short-films/
├── apps/
│   ├── web/                     # Next.js 14 App Router, TypeScript, Tailwind CSS, Custom OTT Player
│   └── mobile/                  # Flutter Android Application (Clean Architecture, Riverpod, GoRouter)
├── supabase/
│   ├── migrations/              # 20 PostgreSQL tables, automated triggers, RLS policies, indexing
│   └── seed/                    # Demo content seed SQL script
├── docs/                        # Comprehensive platform documentation
│   ├── ARCHITECTURE.md          # System design & data flow
│   ├── DATABASE.md              # Database schema & indexing documentation
│   ├── SECURITY.md              # RLS policies & RBAC rules
│   ├── DEPLOYMENT.md            # Vercel & Supabase production setup
│   ├── TESTING.md               # Automated & manual testing checklist
│   ├── ADMIN_GUIDE.md           # Admin dashboard & moderation workflow
│   └── MOBILE_BUILD.md          # Flutter APK release build steps
├── .env.example                 # Documented environment variables
└── README.md                    # Main project guide
```

---

## 🚀 Key Features

### 🌐 Web & OTT Streaming
* **Cinematic Dark Design System:** Charcoal interface (`#07080B`), gold/crimson accents, movie posters, hero spotlight.
* **Hero Banner & Rows:** Featured spotlight, Trending Now, Top Rated, Languages (10+ Indian languages), Genres.
* **Live Search & Multi-Filter:** Debounced title/director/actor search with language & genre filters.
* **Custom OTT Video Player:** Play/pause, seek slider, volume control, fullscreen, and watch position saving.
* **1–5 Star Ratings & Reviews:** Automated rating recalculation triggers, user reviews, like buttons.
* **Comments & Anti-Spam:** Rate-limited comment discussions with moderation reporting.
* **Filmmaker Submissions:** Complete film upload workflow (Draft, Submitted, Under Review, Approved, Rejected).

### 🛠️ Admin Dashboard (`/admin`)
* **Live Analytics Overview:** Total Users, Published Films, Pending Submissions, Video Views, Reviews, Reports.
* **Film Catalog Management:** Feature spotlighting, trending marking, status updates.
* **Submission Review Queue:** Approval & rejection workflow with rejection reason input modal.
* **Content Moderation:** User report queue for copyright, abusive speech, or spam.

### 📱 Flutter Android Application
* **Clean Architecture:** Feature-based structure (`core/`, `features/`).
* **Riverpod & GoRouter:** Reactive state management and declarative navigation.
* **Bottom Navigation Bar:** Home, Discover, Watchlist, Profile tabs.

---

## 🔧 Getting Started

### 1. Web Application (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

To run production build:
```bash
npm run build
npm start
```

### 2. Database Migration & Setup (Supabase)

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Execute the schema migration SQL: `supabase/migrations/20260915000000_initial_schema.sql`.
3. Execute the seed data script: `supabase/seed/seed.sql`.
4. Copy `.env.example` to `.env.local` in `apps/web` and set your Supabase URL and Anon Key.

### 3. Flutter Android App

```bash
cd apps/mobile
flutter pub get
flutter run
```

To build a release APK:
```bash
flutter build apk --release
```

---

## 📄 Complete Documentation

* 📐 [Architecture Documentation](docs/ARCHITECTURE.md)
* 🗄️ [Database Schema & Triggers](docs/DATABASE.md)
* 🔐 [Security & RLS Policies](docs/SECURITY.md)
* 🚀 [Production Deployment Guide](docs/DEPLOYMENT.md)
* 🧪 [Testing & Verification Guide](docs/TESTING.md)
* 🛠️ [Admin Dashboard Guide](docs/ADMIN_GUIDE.md)
* 📱 [Android Mobile Build Guide](docs/MOBILE_BUILD.md)

---

## 📜 License
Released under the MIT License.
