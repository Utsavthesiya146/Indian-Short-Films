# 🗄️ Database Schema & Triggers Documentation

## Table Schema Overview (20 Tables)

### 1. `profiles`
Stores user profile information synced with `auth.users`.
- `id` (UUID PK references `auth.users`)
- `full_name`, `username`, `email`, `avatar_url`, `bio`, `location`, `languages`, `role`

### 2. `films`
Main catalog of Indian short films.
- `id` (UUID PK)
- `title`, `slug`, `description`, `poster_url`, `banner_url`, `video_url`, `trailer_url`
- `duration_seconds`, `release_year`, `certificate`, `director`, `producer`, `cast_members`, `production_house`
- `status` ('draft', 'pending_review', 'approved', 'rejected', 'archived')
- `visibility` ('public', 'private', 'unlisted')
- `views_count`, `likes_count`, `rating_average`, `rating_count`, `filmmaker_id`

### 3. `languages` & `genres`
System metadata tables for film categorization across Indian regional languages.

### 4. `watchlists` & `watch_history`
Tracks saved items and video watch position (seconds, completion percentage).

### 5. `ratings`, `reviews`, `comments`
1-5 star user ratings, written reviews, and film discussion comments.

### 6. `submissions`
Filmmaker film upload workflow records with rejection reason feedback.

### 7. `admin_actions`
Audit log recording every administrative action (approvals, deletions, feature toggles).

## Automated Triggers
- `on_auth_user_created`: Auto-creates profile row upon signup.
- `trigger_recalculate_rating`: Recalculates `rating_average` and `rating_count` on `films`.
- `trigger_film_likes_count`: Recalculates `likes_count` on `films`.
