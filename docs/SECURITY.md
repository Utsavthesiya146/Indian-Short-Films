# 🔐 Security Architecture & RLS Policies

## Security Rules
1. **Never Expose Secret Keys:** Client applications (Next.js & Flutter) ONLY consume `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The `SUPABASE_SERVICE_ROLE_KEY` is strictly reserved for backend server operations.
2. **Row Level Security (RLS):** RLS is enabled on all 20 tables.

## RLS Access Summary Table
| Table | Public Read | Owner Modify | Admin Full Access |
|---|---|---|---|
| `profiles` | Yes | Yes (own profile) | Yes |
| `films` | Approved & Public only | Filmmaker (own drafts) | Yes |
| `watchlists` | No | Yes (own watchlist) | Yes |
| `ratings` | Yes | Yes (own rating) | Yes |
| `reviews` | Published only | Yes (own review) | Yes |
| `comments` | Published only | Yes (own comment) | Yes |
| `submissions` | No | Filmmaker (own) | Yes |
| `admin_actions` | No | No | Yes |

## Storage Security Policies
- `avatars`: Authenticated users upload to own folder path; public read.
- `film-posters` & `film-banners`: Approved filmmakers & admins upload; public read.
- `film-videos`: Validated mime type uploads (`video/mp4`, `video/webm`, `application/x-mpegURL`); public read for approved films.
