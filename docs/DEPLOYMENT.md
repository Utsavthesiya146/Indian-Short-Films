# 🚀 Production Deployment Guide

## Web Deployment (Vercel)
1. Import repository into Vercel Dashboard.
2. Select Framework Preset: **Next.js**.
3. Set Root Directory: `apps/web`.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically build the Next.js App Router bundle.

## Backend Deployment (Supabase)
1. Initialize Supabase project via CLI or Dashboard.
2. Execute migration script `supabase/migrations/20260915000000_initial_schema.sql`.
3. Load seed data via `supabase/seed/seed.sql`.
4. Create storage buckets: `avatars`, `film-posters`, `film-banners`, `film-videos`, `film-trailers`.
