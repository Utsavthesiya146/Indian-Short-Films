-- Migration: 20260915000000_initial_schema.sql
-- Description: Complete schema, triggers, RLS policies for Indian Short Films platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. ENUMS & CONSTANTS
-- ==========================================

-- User Roles: 'user', 'filmmaker', 'admin', 'moderator'
-- Film Status: 'draft', 'pending_review', 'approved', 'rejected', 'archived'
-- Film Visibility: 'public', 'private', 'unlisted'

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    languages TEXT[] DEFAULT '{}',
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'filmmaker', 'admin', 'moderator')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LANGUAGES
CREATE TABLE IF NOT EXISTS public.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    native_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GENRES
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILMMAKERS
CREATE TABLE IF NOT EXISTS public.filmmakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    location TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    awards JSONB DEFAULT '[]'::jsonb,
    followers_count INT NOT NULL DEFAULT 0,
    total_views INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILMS
CREATE TABLE IF NOT EXISTS public.films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    banner_url TEXT,
    video_url TEXT NOT NULL,
    trailer_url TEXT,
    duration_seconds INT NOT NULL DEFAULT 0,
    release_year INT NOT NULL,
    certificate TEXT DEFAULT 'U' CHECK (certificate IN ('U', 'UA 7+', 'UA 13+', 'UA 16+', 'A')),
    director TEXT NOT NULL,
    producer TEXT,
    cast_members JSONB DEFAULT '[]'::jsonb,
    production_house TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'archived')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    views_count INT NOT NULL DEFAULT 0,
    likes_count INT NOT NULL DEFAULT 0,
    rating_average NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    filmmaker_id UUID REFERENCES public.filmmakers(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- FILM LANGUAGES
CREATE TABLE IF NOT EXISTS public.film_languages (
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, language_id)
);

-- FILM GENRES
CREATE TABLE IF NOT EXISTS public.film_genres (
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, genre_id)
);

-- WATCHLISTS
CREATE TABLE IF NOT EXISTS public.watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- WATCH HISTORY
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    last_position_seconds INT NOT NULL DEFAULT 0,
    duration_seconds INT NOT NULL DEFAULT 0,
    completion_percentage INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- RATINGS
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rating_id UUID REFERENCES public.ratings(id) ON DELETE SET NULL,
    likes_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILM VIEWS
CREATE TABLE IF NOT EXISTS public.film_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ip_address TEXT,
    watched_seconds INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILM LIKES
CREATE TABLE IF NOT EXISTS public.film_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filmmaker_id UUID NOT NULL REFERENCES public.filmmakers(id) ON DELETE CASCADE,
    film_id UUID REFERENCES public.films(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    banner_url TEXT,
    video_url TEXT NOT NULL,
    trailer_url TEXT,
    language_id UUID REFERENCES public.languages(id) ON DELETE SET NULL,
    genre_ids UUID[] DEFAULT '{}',
    duration_seconds INT NOT NULL DEFAULT 0,
    release_year INT NOT NULL,
    director TEXT NOT NULL,
    producer TEXT,
    cast_members JSONB DEFAULT '[]'::jsonb,
    production_house TEXT,
    certificate TEXT DEFAULT 'U',
    content_warning TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published')),
    rejection_reason TEXT,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FEATURED FILMS
CREATE TABLE IF NOT EXISTS public.featured_films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    active_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRENDING FILMS
CREATE TABLE IF NOT EXISTS public.trending_films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    score NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rank INT NOT NULL DEFAULT 0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('film', 'review', 'comment', 'user')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('copyright', 'abusive', 'hate_speech', 'sexual', 'violence', 'spam', 'misleading', 'other')),
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ADMIN ACTIONS AUDIT LOG
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. INDEXES FOR HIGH PERFORMANCE SEARCH
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_films_title ON public.films (title);
CREATE INDEX IF NOT EXISTS idx_films_slug ON public.films (slug);
CREATE INDEX IF NOT EXISTS idx_films_status ON public.films (status);
CREATE INDEX IF NOT EXISTS idx_films_visibility ON public.films (visibility);
CREATE INDEX IF NOT EXISTS idx_films_published_at ON public.films (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_films_rating_avg ON public.films (rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_films_views_count ON public.films (views_count DESC);
CREATE INDEX IF NOT EXISTS idx_films_likes_count ON public.films (likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_film_id ON public.ratings (film_id);
CREATE INDEX IF NOT EXISTS idx_reviews_film_id ON public.reviews (film_id);
CREATE INDEX IF NOT EXISTS idx_comments_film_id ON public.comments (film_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON public.watchlists (user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions (status);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);

-- ==========================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================

-- Trigger: Automatically create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, username, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text FROM 1 FOR 6)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Prevent Unauthorized User Role Escalation
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Unauthorized: Only system administrators can alter user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Trigger: Recalculate Film Rating Average & Count
CREATE OR REPLACE FUNCTION public.recalculate_film_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_film_id UUID;
    avg_val NUMERIC(3, 2);
    cnt_val INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_film_id := OLD.film_id;
    ELSE
        target_film_id := NEW.film_id;
    END IF;

    SELECT COALESCE(AVG(stars), 0.00), COUNT(*)
    INTO avg_val, cnt_val
    FROM public.ratings
    WHERE film_id = target_film_id;

    UPDATE public.films
    SET rating_average = avg_val,
        rating_count = cnt_val,
        updated_at = NOW()
    WHERE id = target_film_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_recalculate_rating ON public.ratings;
CREATE TRIGGER trigger_recalculate_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_film_rating();

-- Trigger: Update Film Likes Count
CREATE OR REPLACE FUNCTION public.update_film_likes_count()
RETURNS TRIGGER AS $$
DECLARE
    target_film_id UUID;
    likes_cnt INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_film_id := OLD.film_id;
    ELSE
        target_film_id := NEW.film_id;
    END IF;

    SELECT COUNT(*) INTO likes_cnt
    FROM public.film_likes
    WHERE film_id = target_film_id;

    UPDATE public.films
    SET likes_count = likes_cnt
    WHERE id = target_film_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_film_likes_count ON public.film_likes;
CREATE TRIGGER trigger_film_likes_count
    AFTER INSERT OR DELETE ON public.film_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_film_likes_count();

-- Function: Increment Film View Count deterministically
CREATE OR REPLACE FUNCTION public.increment_film_view(p_film_id UUID, p_user_id UUID DEFAULT NULL, p_ip TEXT DEFAULT NULL, p_watched_seconds INT DEFAULT 0)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.film_views (film_id, user_id, ip_address, watched_seconds)
    VALUES (p_film_id, p_user_id, p_ip, p_watched_seconds);

    UPDATE public.films
    SET views_count = views_count + 1
    WHERE id = p_film_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Calculate Trending Films (Score = views*1 + likes*3 + rating_avg*rating_cnt*2)
CREATE OR REPLACE FUNCTION public.calculate_trending_films()
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.trending_films;

    INSERT INTO public.trending_films (film_id, score, rank, calculated_at)
    SELECT 
        f.id,
        (f.views_count * 1.0 + f.likes_count * 3.0 + f.rating_average * f.rating_count * 2.0) AS score,
        ROW_NUMBER() OVER (ORDER BY (f.views_count * 1.0 + f.likes_count * 3.0 + f.rating_average * f.rating_count * 2.0) DESC) AS rank,
        NOW()
    FROM public.films f
    WHERE f.status = 'approved' AND f.visibility = 'public'
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filmmakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone read, Users edit own, Admin all
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Languages & Genres: Public read, Admin write
CREATE POLICY "Languages public view" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Genres public view" ON public.genres FOR SELECT USING (true);

-- Filmmakers: Public view, Owner edit
CREATE POLICY "Filmmakers public view" ON public.filmmakers FOR SELECT USING (true);
CREATE POLICY "Filmmakers edit own profile" ON public.filmmakers FOR UPDATE USING (
    profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Films: Public read for approved & public; Filmmakers read own; Admins read/write all
CREATE POLICY "Public films viewable by all" ON public.films FOR SELECT USING (
    (status = 'approved' AND visibility = 'public') OR
    (filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid())) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "Admins & Filmmakers insert films" ON public.films FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'filmmaker'))
);
CREATE POLICY "Admins & Filmmakers update films" ON public.films FOR UPDATE USING (
    (filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid())) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "Admins delete films" ON public.films FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Film Languages & Film Genres
CREATE POLICY "Film languages public view" ON public.film_languages FOR SELECT USING (true);
CREATE POLICY "Film genres public view" ON public.film_genres FOR SELECT USING (true);

-- Watchlists & Watch History: Owner only
CREATE POLICY "Users view own watchlist" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own watchlist" ON public.watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own watchlist" ON public.watchlists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users view own watch history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert/update own watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id);

-- Ratings, Reviews, Likes, Comments: Public read, User insert/edit own
CREATE POLICY "Ratings public view" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users manage own ratings" ON public.ratings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Reviews public view" ON public.reviews FOR SELECT USING (status = 'published' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "Users manage own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Likes public view" ON public.film_likes FOR SELECT USING (true);
CREATE POLICY "Users manage own likes" ON public.film_likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Comments public view" ON public.comments FOR SELECT USING (status = 'published' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "Users manage own comments" ON public.comments FOR ALL USING (auth.uid() = user_id);

-- Submissions: Filmmaker manage own; Admin all
CREATE POLICY "Filmmakers view own submissions" ON public.submissions FOR SELECT USING (
    filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "Filmmakers insert own submissions" ON public.submissions FOR INSERT WITH CHECK (
    filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "Filmmakers update own submissions" ON public.submissions FOR UPDATE USING (
    filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Featured & Trending Films
CREATE POLICY "Featured public view" ON public.featured_films FOR SELECT USING (true);
CREATE POLICY "Trending public view" ON public.trending_films FOR SELECT USING (true);

-- Reports & Notifications
CREATE POLICY "Users insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins view reports" ON public.reports FOR SELECT USING (
    auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admin Actions Audit Log
CREATE POLICY "Admins view audit logs" ON public.admin_actions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 6. STORAGE BUCKET POLICIES
-- ==========================================

INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('film-posters', 'film-posters', true),
('film-banners', 'film-banners', true),
('film-videos', 'film-videos', true),
('film-trailers', 'film-trailers', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for media buckets
CREATE POLICY "Public media read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public media read posters" ON storage.objects FOR SELECT USING (bucket_id = 'film-posters');
CREATE POLICY "Public media read banners" ON storage.objects FOR SELECT USING (bucket_id = 'film-banners');
CREATE POLICY "Public media read videos" ON storage.objects FOR SELECT USING (bucket_id = 'film-videos');
CREATE POLICY "Public media read trailers" ON storage.objects FOR SELECT USING (bucket_id = 'film-trailers');

-- Authenticated upload access
CREATE POLICY "Users upload own avatars" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
);
CREATE POLICY "Filmmakers & Admins upload film media" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id IN ('film-posters', 'film-banners', 'film-videos', 'film-trailers') AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'filmmaker'))
);

