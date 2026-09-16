# 🎬 Indian Short Films — Supabase Setup & Environment Guide

This document outlines the environment configuration and database setup required to run the **Indian Short Films** Web (`apps/web`) and Mobile (`apps/mobile`) applications with a live Supabase backend.

---

## 1. Database Setup in Supabase SQL Editor

1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (`qmqtnrdwxubfrrtlkbfi`).
3. Navigate to **SQL Editor** -> **New Query**.
4. Open the SQL setup script located at:
   ```text
   supabase/INDIAN_SHORT_FILMS_SUPABASE_SETUP.sql
   ```
5. Copy the entire contents and paste them into the SQL Editor.
6. Click **Run**.

### What this SQL script provisions:
* **20 System Tables**: `profiles`, `languages`, `genres`, `filmmakers`, `films`, `watchlists`, `watch_history`, `ratings`, `reviews`, `comments`, `submissions`, `film_likes`, `film_views`, `featured_films`, `trending_films`, `reports`, `notifications`, `admin_actions`, etc.
* **Security & RLS Policies**: 31 Row Level Security (RLS) policies protecting user data.
* **Security Triggers**:
  * `on_auth_user_created`: Automatically creates a `public.profiles` row upon signup, forcing `role = 'user'`.
  * `prevent_role_escalation`: Blocks non-admin users from altering their role via API requests.
  * `protect_film_counters`: Restricts direct modification of view/like/rating counters.
* **5 Storage Buckets**: `avatars`, `film-posters`, `film-banners`, `film-videos`, `film-trailers`.
* **Seed Data**: 14 Indian languages, 16 genres, 5 demo filmmakers, and 20 curated Indian short films.

---

## 2. Environment Variables Configuration

### Web Application (`apps/web`)
Create or edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qmqtnrdwxubfrrtlkbfi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

> **Note**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for client-side inclusion. `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed in client-side code or browser bundles.

### Mobile Application (`apps/mobile`)
Configured in `apps/mobile/lib/core/constants/supabase_constants.dart`:

```dart
class SupabaseConstants {
  static const String supabaseUrl = 'https://qmqtnrdwxubfrrtlkbfi.supabase.co';
  static const String supabaseAnonKey = 'your_supabase_anon_key_here';
}
```

---

## 3. Storage Bucket Configuration

Verify in **Supabase Dashboard -> Storage** that the following buckets exist and are set to **Public**:
1. `avatars`
2. `film-posters`
3. `film-banners`
4. `film-videos`
5. `film-trailers`

All necessary storage policies are created automatically by `INDIAN_SHORT_FILMS_SUPABASE_SETUP.sql`.

---

## 4. Verification & Testing Commands

### Web (`apps/web`)
```bash
cd apps/web
npx tsc --noEmit
npm run lint
npm run build
```

### Mobile (`apps/mobile`)
```bash
cd apps/mobile
flutter analyze
flutter test
```
