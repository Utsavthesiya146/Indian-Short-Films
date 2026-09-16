# 🚀 Indian Short Films — Supabase Database Setup & Security Guide

This guide details the step-by-step process for initializing your live Supabase database and connecting it securely to the **Indian Short Films** Web and Mobile applications.

---

## 🔒 Security Hardening Architecture Highlights

1. **Auth Role Escalation Protection**:
   - `handle_new_user()` trigger **always** forces `role = 'user'` on public signup. Clients cannot inject `admin`/`moderator` roles via signup metadata.
   - `prevent_role_escalation()` trigger blocks non-admin users from altering their `role` column via REST API updates.
2. **Profile Privacy**:
   - RLS on `public.profiles` prevents anonymous users from scraping sensitive email addresses. Users can only select their own full profile record; admins/moderators can view all records for dashboard analytics and content moderation.
3. **Film Counter Protection**:
   - `protect_film_counters()` trigger blocks clients from directly editing `rating_average`, `rating_count`, `views_count`, and `likes_count` columns.
   - Counters are maintained exclusively via database triggers (`recalculate_film_rating`, `update_film_likes_count`) and trusted SECURITY DEFINER functions (`increment_film_view`).
4. **Function Execution Security**:
   - `calculate_trending_films()` requires administrator role or service-role privileges. Anonymous execution is revoked.
   - `increment_film_view()` automatically derives `user_id` from `auth.uid()` instead of accepting untrusted user parameters from the client.
5. **Storage Bucket Security**:
   - `avatars`, `film-posters`, `film-banners`, `film-videos`, and `film-trailers` have strict public read access and role-gated upload/delete permissions.

---

## 📋 Step-by-Step Supabase Setup

### Step 1: Log in to Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Select your **Indian Short Films** project.

### Step 2: Open SQL Editor
1. In the left-hand navigation sidebar, click on **SQL Editor** (`>_`).
2. Click **+ New Query** at the top left of the SQL Editor screen.

### Step 3: Copy and Paste Setup SQL Script
1. Open the updated SQL setup file:
   ```text
   D:\Indian Short Films\supabase\INDIAN_SHORT_FILMS_SUPABASE_SETUP.sql
   ```
2. Select all content (`Ctrl + A`) and copy it (`Ctrl + C`).
3. Paste into the Supabase SQL Editor (`Ctrl + V`).

### Step 4: Run the Script
1. Click the green **Run** button (or press `Ctrl + Enter`).
2. Verify that the execution completes without errors.

### Step 5: Check Verification Output
At the bottom of the SQL Editor, verify the returned metrics:

| Metric | Expected Value | Description |
| :--- | :--- | :--- |
| `total_languages` | **14** | Core Indian languages inserted |
| `total_genres` | **16** | Core film genres inserted |
| `total_demo_filmmakers` | **5** | Safe system demo filmmakers (no fake auth users) |
| `total_approved_films` | **20** | Realistic approved demo short films with fictional cast/crew |
| `total_featured_films` | **5** | Home page hero carousel featured films |
| `total_trending_films` | **20** | Calculated trending score rankings |
| `storage_buckets_created` | **5** | Storage buckets initialized (`avatars`, `film-posters`, `film-banners`, `film-videos`, `film-trailers`) |

---

## ⚙️ Application Configuration

### Web App (`apps/web`)

1. Ensure `apps/web/.env.local` contains your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
2. Run development or build checks:
   ```bash
   cd "D:\Indian Short Films\apps\web"
   npm run dev
   ```

### Mobile App (`apps/mobile`)

Initialize Supabase in Flutter with `supabaseUrl` and `supabaseAnonKey`.

---

## ❓ Troubleshooting & FAQs

### Is the script safe to run multiple times?
**Yes.** The script is 100% idempotent and non-destructive. It uses `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, `DROP TRIGGER IF EXISTS`, and `DROP POLICY IF EXISTS`. It will **never** delete user accounts or existing production data.
