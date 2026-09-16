# 🌐 Indian Short Films — Web Production Deployment Guide

This guide outlines the complete setup for deploying the **Indian Short Films** Next.js application (`apps/web`) to production hosting (such as **Vercel** or **AWS Amplify**).

---

## 1. Status

* **Status:** `BLOCKED — Deployment credentials / production Vercel account access required from project administrator`
* **Local Build Status:** `PASS` (17/17 routes compiled successfully with zero errors).

---

## 2. Environment Variables Configuration

The following variables must be configured in your hosting platform's Dashboard (e.g., Vercel -> Settings -> Environment Variables):

| Environment Variable | Scope | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | `https://qmqtnrdwxubfrrtlkbfi.supabase.co` | Public API endpoint for Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | `sb_publishable_fS36qWLmk7LNwrtN6boJHw...` | Public publishable key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only** | `sb_secret_t_-8nKxP0-8zRJ5VIB1DAA...` | **STRICTLY SECRET** server key for administrative functions |

> ⚠️ **CRITICAL SECURITY WARNING:**  
> Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code, browser bundles, or public repositories.

---

## 3. Recommended Build & Deployment Settings

If deploying to **Vercel**:
* **Framework Preset:** Next.js
* **Root Directory:** `apps/web`
* **Build Command:** `npm run build` (or `next build`)
* **Install Command:** `npm install`
* **Output Directory:** Default (`.next`)
* **Node.js Version:** `18.x` or `20.x`

---

## 4. Supabase Authentication & Domain Setup

1. **Auth Redirect URLs:**
   In **Supabase Dashboard -> Authentication -> URL Configuration**:
   - Site URL: `https://your-production-domain.com`
   - Redirect URLs:
     - `https://your-production-domain.com/**`
     - `https://your-production-domain.com/login`
     - `https://your-production-domain.com/register`

2. **CORS & Storage URLs:**
   Verify that video assets hosted on Supabase Storage (`film-videos`, `film-posters`) serve with standard public caching headers.

---

## 5. Post-Deployment Testing Checklist

- [ ] Verify SSL certificate (`https://`).
- [ ] Test `/login` and `/register` authentication flows.
- [ ] Verify film discovery search, language filters, and category dropdowns.
- [ ] Play a short film video on `/film/[slug]` and verify playback position autosave.
- [ ] Test submission form (`/submit`) file uploads to Supabase storage.
- [ ] Test admin panel metrics and moderation queues at `/admin`.
