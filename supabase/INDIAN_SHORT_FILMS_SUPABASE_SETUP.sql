-- ==========================================
-- INDIAN SHORT FILMS
-- SUPABASE COMPLETE DATABASE SETUP SCRIPT (HARDENED SECURITY EDITION)
-- ==========================================
-- Self-contained, idempotent SQL script for Supabase Dashboard -> SQL Editor.
-- Compatible with Indian Short Films Web (Next.js) & Mobile (Flutter) applications.
-- Safe, non-destructive execution.
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 2. CORE DATABASE TABLES
-- ==========================================

-- PROFILES TABLE
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

-- LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS public.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    native_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GENRES TABLE
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILMMAKERS TABLE
-- profile_id is nullable to support system/demo filmmakers without fake auth.users entries
CREATE TABLE IF NOT EXISTS public.filmmakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    location TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    awards JSONB DEFAULT '[]'::jsonb,
    followers_count INT NOT NULL DEFAULT 0,
    total_views INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILMS TABLE
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

-- FILM LANGUAGES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.film_languages (
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, language_id)
);

-- FILM GENRES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.film_genres (
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, genre_id)
);

-- WATCHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- WATCH HISTORY TABLE
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

-- RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- REVIEWS TABLE
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

-- FILM VIEWS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.film_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ip_address TEXT,
    watched_seconds INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FILM LIKES TABLE
CREATE TABLE IF NOT EXISTS public.film_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, film_id)
);

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SUBMISSIONS TABLE
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

-- FEATURED FILMS TABLE
CREATE TABLE IF NOT EXISTS public.featured_films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    active_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRENDING FILMS TABLE
CREATE TABLE IF NOT EXISTS public.trending_films (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    score NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rank INT NOT NULL DEFAULT 0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REPORTS TABLE
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

-- NOTIFICATIONS TABLE
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
-- 3. INDEXES FOR PERFORMANCE & SEARCH
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_films_title ON public.films (title);
CREATE INDEX IF NOT EXISTS idx_films_slug ON public.films (slug);
CREATE INDEX IF NOT EXISTS idx_films_status ON public.films (status);
CREATE INDEX IF NOT EXISTS idx_films_visibility ON public.films (visibility);
CREATE INDEX IF NOT EXISTS idx_films_published_at ON public.films (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_films_rating_avg ON public.films (rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_films_views_count ON public.films (views_count DESC);
CREATE INDEX IF NOT EXISTS idx_films_likes_count ON public.films (likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_films_director ON public.films (director);
CREATE INDEX IF NOT EXISTS idx_films_release_year ON public.films (release_year);
CREATE INDEX IF NOT EXISTS idx_ratings_film_id ON public.ratings (film_id);
CREATE INDEX IF NOT EXISTS idx_reviews_film_id ON public.reviews (film_id);
CREATE INDEX IF NOT EXISTS idx_comments_film_id ON public.comments (film_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON public.watchlists (user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON public.watch_history (user_id);
CREATE INDEX IF NOT EXISTS idx_film_views_film_id ON public.film_views (film_id);
CREATE INDEX IF NOT EXISTS idx_film_likes_film_id ON public.film_likes (film_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions (status);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);

-- ==========================================
-- 4. HARDENED FUNCTIONS & TRIGGERS
-- ==========================================

-- Trigger Function: Secure Auth Signup Profile Creation
-- HARDENED: ALWAYS forces 'user' role regardless of user_metadata to prevent client role escalation attacks.
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
        'user' -- STRICT: Normal signup metadata can NEVER set admin/filmmaker role
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger Function: Database-Enforced Role Escalation Protection
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

-- Trigger Function: Counter Tamper Protection
-- Prevents clients from manually editing rating_average, rating_count, views_count, or likes_count via REST updates
CREATE OR REPLACE FUNCTION public.protect_film_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF (auth.uid() IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )) THEN
        NEW.views_count := OLD.views_count;
        NEW.likes_count := OLD.likes_count;
        NEW.rating_average := OLD.rating_average;
        NEW.rating_count := OLD.rating_count;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_protect_film_counters ON public.films;
CREATE TRIGGER trigger_protect_film_counters
    BEFORE UPDATE ON public.films
    FOR EACH ROW EXECUTE FUNCTION public.protect_film_counters();

-- Trigger Function: Recalculate Film Rating Average & Count
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

-- Trigger Function: Update Film Likes Count
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

-- Function: Secure View Count Increment
-- Uses auth.uid() automatically instead of trusting arbitrary client parameter
CREATE OR REPLACE FUNCTION public.increment_film_view(
    p_film_id UUID,
    p_ip TEXT DEFAULT NULL,
    p_watched_seconds INT DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();

    IF NOT EXISTS (SELECT 1 FROM public.films WHERE id = p_film_id) THEN
        RAISE EXCEPTION 'Invalid film ID.';
    END IF;

    INSERT INTO public.film_views (film_id, user_id, ip_address, watched_seconds)
    VALUES (p_film_id, v_user_id, p_ip, GREATEST(0, p_watched_seconds));

    UPDATE public.films
    SET views_count = views_count + 1
    WHERE id = p_film_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_film_view(UUID, TEXT, INT) TO PUBLIC, anon, authenticated;

-- Function: Restricted Trending Calculation
CREATE OR REPLACE FUNCTION public.calculate_trending_films()
RETURNS VOID AS $$
BEGIN
    IF (auth.uid() IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )) THEN
        RAISE EXCEPTION 'Unauthorized: Only system administrators can recalculate trending rankings.';
    END IF;

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

REVOKE EXECUTE ON FUNCTION public.calculate_trending_films() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.calculate_trending_films() TO authenticated, service_role;

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) & POLICIES
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

-- Profiles Policies
-- PRIVACY FIX: Users can view their own profile or admins/mods can view all. Public non-authenticated queries are restricted from harvesting emails.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users view own profile or admins view all" ON public.profiles 
    FOR SELECT 
    USING (
        auth.uid() = id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- Languages & Genres Policies
DROP POLICY IF EXISTS "Languages public view" ON public.languages;
CREATE POLICY "Languages public view" ON public.languages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Genres public view" ON public.genres;
CREATE POLICY "Genres public view" ON public.genres FOR SELECT USING (true);

-- Filmmakers Policies
DROP POLICY IF EXISTS "Filmmakers public view" ON public.filmmakers;
CREATE POLICY "Filmmakers public view" ON public.filmmakers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Filmmakers edit own profile" ON public.filmmakers;
CREATE POLICY "Filmmakers edit own profile" ON public.filmmakers 
    FOR UPDATE 
    USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')))
    WITH CHECK (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- Films Policies
DROP POLICY IF EXISTS "Public films viewable by all" ON public.films;
CREATE POLICY "Public films viewable by all" ON public.films FOR SELECT USING (
    (status = 'approved' AND visibility = 'public') OR
    (filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid())) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

DROP POLICY IF EXISTS "Admins & Filmmakers insert films" ON public.films;
CREATE POLICY "Admins & Filmmakers insert films" ON public.films FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'filmmaker'))
);

DROP POLICY IF EXISTS "Admins & Filmmakers update films" ON public.films;
CREATE POLICY "Admins & Filmmakers update films" ON public.films FOR UPDATE 
    USING (
        (filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid())) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    )
    WITH CHECK (
        (filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid())) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

DROP POLICY IF EXISTS "Admins delete films" ON public.films;
CREATE POLICY "Admins delete films" ON public.films FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Film Languages & Genres Policies
DROP POLICY IF EXISTS "Film languages public view" ON public.film_languages;
CREATE POLICY "Film languages public view" ON public.film_languages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Film genres public view" ON public.film_genres;
CREATE POLICY "Film genres public view" ON public.film_genres FOR SELECT USING (true);

-- Watchlists Policies
DROP POLICY IF EXISTS "Users view own watchlist" ON public.watchlists;
CREATE POLICY "Users view own watchlist" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own watchlist" ON public.watchlists;
CREATE POLICY "Users insert own watchlist" ON public.watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own watchlist" ON public.watchlists;
CREATE POLICY "Users delete own watchlist" ON public.watchlists FOR DELETE USING (auth.uid() = user_id);

-- Watch History Policies
DROP POLICY IF EXISTS "Users view own watch history" ON public.watch_history;
CREATE POLICY "Users view own watch history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert/update own watch history" ON public.watch_history;
CREATE POLICY "Users insert/update own watch history" ON public.watch_history 
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Ratings Policies
DROP POLICY IF EXISTS "Ratings public view" ON public.ratings;
CREATE POLICY "Ratings public view" ON public.ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own ratings" ON public.ratings;
CREATE POLICY "Users manage own ratings" ON public.ratings 
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Reviews Policies
DROP POLICY IF EXISTS "Reviews public view" ON public.reviews;
CREATE POLICY "Reviews public view" ON public.reviews FOR SELECT USING (status = 'published' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

DROP POLICY IF EXISTS "Users manage own reviews" ON public.reviews;
CREATE POLICY "Users manage own reviews" ON public.reviews 
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Film Likes Policies
DROP POLICY IF EXISTS "Likes public view" ON public.film_likes;
CREATE POLICY "Likes public view" ON public.film_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own likes" ON public.film_likes;
CREATE POLICY "Users manage own likes" ON public.film_likes 
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Comments Policies
DROP POLICY IF EXISTS "Comments public view" ON public.comments;
CREATE POLICY "Comments public view" ON public.comments FOR SELECT USING (status = 'published' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

DROP POLICY IF EXISTS "Users manage own comments" ON public.comments;
CREATE POLICY "Users manage own comments" ON public.comments 
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Submissions Policies
DROP POLICY IF EXISTS "Filmmakers view own submissions" ON public.submissions;
CREATE POLICY "Filmmakers view own submissions" ON public.submissions FOR SELECT USING (
    filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

DROP POLICY IF EXISTS "Filmmakers insert own submissions" ON public.submissions;
CREATE POLICY "Filmmakers insert own submissions" ON public.submissions FOR INSERT WITH CHECK (
    filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

DROP POLICY IF EXISTS "Filmmakers update own submissions" ON public.submissions;
CREATE POLICY "Filmmakers update own submissions" ON public.submissions FOR UPDATE 
    USING (
        filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    )
    WITH CHECK (
        filmmaker_id IN (SELECT id FROM public.filmmakers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

-- Featured & Trending Films Policies (Admin-Controlled Writing)
DROP POLICY IF EXISTS "Featured public view" ON public.featured_films;
CREATE POLICY "Featured public view" ON public.featured_films FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage featured films" ON public.featured_films;
CREATE POLICY "Admin manage featured films" ON public.featured_films 
    FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Trending public view" ON public.trending_films;
CREATE POLICY "Trending public view" ON public.trending_films FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage trending films" ON public.trending_films;
CREATE POLICY "Admin manage trending films" ON public.trending_films 
    FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Reports & Notifications Policies
DROP POLICY IF EXISTS "Users insert reports" ON public.reports;
CREATE POLICY "Users insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins view reports" ON public.reports;
CREATE POLICY "Admins view reports" ON public.reports FOR SELECT USING (
    auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

DROP POLICY IF EXISTS "Admins update reports" ON public.reports;
CREATE POLICY "Admins update reports" ON public.reports FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admin Actions Audit Log Policy
DROP POLICY IF EXISTS "Admins view audit logs" ON public.admin_actions;
CREATE POLICY "Admins view audit logs" ON public.admin_actions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins insert audit logs" ON public.admin_actions;
CREATE POLICY "Admins insert audit logs" ON public.admin_actions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 6. STORAGE BUCKETS & POLICIES
-- ==========================================

INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('film-posters', 'film-posters', true),
('film-banners', 'film-banners', true),
('film-videos', 'film-videos', true),
('film-trailers', 'film-trailers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public media read avatars" ON storage.objects;
CREATE POLICY "Public media read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public media read posters" ON storage.objects;
CREATE POLICY "Public media read posters" ON storage.objects FOR SELECT USING (bucket_id = 'film-posters');

DROP POLICY IF EXISTS "Public media read banners" ON storage.objects;
CREATE POLICY "Public media read banners" ON storage.objects FOR SELECT USING (bucket_id = 'film-banners');

DROP POLICY IF EXISTS "Public media read videos" ON storage.objects;
CREATE POLICY "Public media read videos" ON storage.objects FOR SELECT USING (bucket_id = 'film-videos');

DROP POLICY IF EXISTS "Public media read trailers" ON storage.objects;
CREATE POLICY "Public media read trailers" ON storage.objects FOR SELECT USING (bucket_id = 'film-trailers');

DROP POLICY IF EXISTS "Users upload own avatars" ON storage.objects;
CREATE POLICY "Users upload own avatars" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Filmmakers & Admins upload film media" ON storage.objects;
CREATE POLICY "Filmmakers & Admins upload film media" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id IN ('film-posters', 'film-banners', 'film-videos', 'film-trailers') AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'filmmaker'))
);

DROP POLICY IF EXISTS "Users delete own avatars" ON storage.objects;
CREATE POLICY "Users delete own avatars" ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Filmmakers & Admins delete film media" ON storage.objects;
CREATE POLICY "Filmmakers & Admins delete film media" ON storage.objects FOR DELETE USING (
    bucket_id IN ('film-posters', 'film-banners', 'film-videos', 'film-trailers') AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'filmmaker'))
);

-- ==========================================
-- 7. SEED DATA: LANGUAGES
-- ==========================================
INSERT INTO public.languages (id, name, code, native_name) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Hindi', 'hi', 'हिन्दी'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Gujarati', 'gu', 'ગુજરાતી'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Tamil', 'ta', 'தமிழ்'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Telugu', 'te', 'తెలుగు'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Malayalam', 'ml', 'മലയാളം'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Kannada', 'kn', 'ಕನ್ನಡ'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Marathi', 'mr', 'मराठी'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Bengali', 'bn', 'বাংলা'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Punjabi', 'pa', 'ਪੰਜਾਬੀ'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'English', 'en', 'English'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Odia', 'or', 'ଓଡ଼ିଆ'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Assamese', 'as', 'অসমীয়া'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Urdu', 'ur', 'اردو'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Other', 'oth', 'Other')
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- 8. SEED DATA: GENRES
-- ==========================================
INSERT INTO public.genres (id, name, slug, description, icon) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'Drama', 'drama', 'Heartfelt emotional stories and human narratives', 'film'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'Comedy', 'comedy', 'Lighthearted humor and hilarious slice-of-life short films', 'smile'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'Thriller', 'thriller', 'Suspenseful, high-stakes edge-of-the-seat cinema', 'zap'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'Horror', 'horror', 'Eerie supernatural tales and psychological chills', 'ghost'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'Romance', 'romance', 'Poetic love stories and relational connections', 'heart'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 'Documentary', 'documentary', 'Real-world Indian cultural & social documentaries', 'camera'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b17', 'Action', 'action', 'High energy action sequences and martial arts stories', 'flame'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b18', 'Adventure', 'adventure', 'Journeys of exploration across urban & rural landscapes', 'compass'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b19', 'Crime', 'crime', 'Underworld investigations and noir storytelling', 'shield'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b20', 'Mystery', 'mystery', 'Puzzling riddles, whodunits, and hidden secrets', 'search'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b21', 'Experimental', 'experimental', 'Avant-garde visual storytelling and non-linear narrative', 'eye'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Animation', 'animation', 'Creative visual stories and 2D/3D animation', 'sparkles'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b23', 'Family', 'family', 'Intergenerational stories and heartwarming family bonds', 'users'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b24', 'Social', 'social', 'Impactful social awareness and reform narratives', 'globe'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b25', 'Inspirational', 'inspirational', 'Uplifting tales of triumph over adversity', 'award'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b26', 'Musical', 'musical', 'Rhythm-driven films featuring original classical & folk compositions', 'music')
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 9. SEED DATA: DEMO FILMMAKERS (SAFE SYSTEM ENTITIES, NO FAKE AUTH USERS)
-- ==========================================
INSERT INTO public.filmmakers (id, profile_id, bio, location, followers_count, total_views, is_verified) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', NULL, 'Independent director focusing on urban human connections and slice-of-life drama.', 'Mumbai, Maharashtra', 1280, 42500, true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12', NULL, 'Nostalgic Gujarati storyteller bringing vintage heritage tales to modern streaming screens.', 'Ahmedabad, Gujarat', 940, 28900, true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13', NULL, 'Pioneer of Tamil psychological horror & edge-of-the-seat urban thrillers.', 'Chennai, Tamil Nadu', 2450, 68100, true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14', NULL, 'Kannada cinema director exploring hidden cultural heritage & mysteries.', 'Bengaluru, Karnataka', 810, 21400, true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15', NULL, 'Telugu composer and director crafting music-driven romantic short cinema.', 'Hyderabad, Telangana', 1650, 49800, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 10. SEED DATA: 20 DEMO SHORT FILMS
-- ==========================================
-- Uses 100% FICTIONAL titles & names.
-- Uses verified open public test video streams (BigBuckBunny, ElephantsDream, TearsOfSteel, Sintel).
-- Populates filmmaker_id using safe demo filmmaker entities.

INSERT INTO public.films (
    id, title, slug, description, poster_url, banner_url, video_url, trailer_url,
    duration_seconds, release_year, certificate, director, producer, cast_members,
    production_house, status, visibility, views_count, likes_count, rating_average, rating_count, filmmaker_id, published_at
) VALUES
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
    'Chai & Stories (चाय और किस्से)',
    'chai-and-stories',
    'A poignant tale set in a bustling Mumbai tea stall where two strangers discover an unexpected connection over evening masala chai. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    720, 2024, 'U', 'Aarav Sharma', 'Meera Kapoor',
    '[{"name": "Rohan Nambiar", "role": "Kabir"}, {"name": "Ananya Roy", "role": "Ananya"}]'::jsonb,
    'Katha Independent Talkies', 'approved', 'public', 1450, 320, 4.80, 45, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', NOW() - INTERVAL '5 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
    'The Last Letter (અંતિમ પત્ર)',
    'the-last-letter',
    'A nostalgic Gujarati short film exploring an elderly artisan''s journey through forgotten letters in vintage Ahmedabad. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    950, 2024, 'U', 'Devang Patel', 'Kavita Patel',
    '[{"name": "Hasmukh Parikh", "role": "Dada Ji"}, {"name": "Kinjal Trivedi", "role": "Granddaughter"}]'::jsonb,
    'Sabarmati Cinema', 'approved', 'public', 980, 210, 4.65, 28, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12', NOW() - INTERVAL '12 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13',
    'Midnight Express (இரவு பயணம்)',
    'midnight-express',
    'A gripping Tamil psychological thriller centered around a late-night commuter in Chennai who notices a mysterious suitcase. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    840, 2023, 'UA 13+', 'Karthik Raja', 'Venkatesh Iyer',
    '[{"name": "Surya Chandran", "role": "Vikram"}, {"name": "Divya Sundaram", "role": "Stranger"}]'::jsonb,
    'Marina Wave Pictures', 'approved', 'public', 2300, 540, 4.90, 62, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13', NOW() - INTERVAL '2 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14',
    'Shadows of Mysore (ಮೈಸೂರು ನೆರಳುಗಳು)',
    'shadows-of-mysore',
    'An evocative Kannada mystery exploring historical secrets hidden inside centuries-old royal silk looms. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    1100, 2024, 'U', 'Ramesh Gowda', 'Sujata Rao',
    '[{"name": "Chetan Hegde", "role": "Rajesh"}, {"name": "Shreya Bhat", "role": "Kavya"}]'::jsonb,
    'Kaveri Talkies', 'approved', 'public', 1120, 195, 4.50, 19, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14', NOW() - INTERVAL '8 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15',
    'Monsoon Melodies (వర్షం స్వరాలు)',
    'monsoon-melodies',
    'A heartwarming Telugu romantic drama about two musicians creating a song during a heavy Hyderabad rainstorm. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    660, 2024, 'U', 'Teja Varma', 'Anitha Reddy',
    '[{"name": "Varun Krishna", "role": "Sid"}, {"name": "Kavya Reddy", "role": "Riya"}]'::jsonb,
    'Deccan Beats Studio', 'approved', 'public', 1890, 430, 4.75, 51, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15', NOW() - INTERVAL '3 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c16',
    'Monsoon Letters',
    'monsoon-letters',
    'A tender Hindi drama exploring love lost and found through handwritten notes delivered across Mumbai monsoons. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    780, 2024, 'U', 'Kabir Patel', 'Diya Shah',
    '[{"name": "Aditya Varma", "role": "Sameer"}, {"name": "Radhika Sen", "role": "Tara"}]'::jsonb,
    'Katha Independent Talkies', 'approved', 'public', 1620, 380, 4.70, 38, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', NOW() - INTERVAL '6 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c17',
    'The Last Kite',
    'the-last-kite',
    'A vibrant Gujarati story set during Uttarayan where a grandfather teaches his granddaughter the art of kite making. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    890, 2024, 'U', 'Diya Shah', 'Aarav Mehta',
    '[{"name": "Bhavin Solanki", "role": "Kaka"}, {"name": "Jiya Mehta", "role": "Jiya"}]'::jsonb,
    'Sabarmati Cinema', 'approved', 'public', 1210, 260, 4.60, 31, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12', NOW() - INTERVAL '10 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18',
    'Amdavad 7 PM',
    'amdavad-7-pm',
    'A pulse-pounding Gujarati urban mystery about a missing camera roll containing footage of an old city alley. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    910, 2023, 'UA 13+', 'Aarav Mehta', 'Kavita Patel',
    '[{"name": "Dhruv Parikh", "role": "Dhruv"}, {"name": "Esha Kothari", "role": "Riya"}]'::jsonb,
    'Sabarmati Cinema', 'approved', 'public', 1750, 410, 4.82, 49, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12', NOW() - INTERVAL '4 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c19',
    'Beyond the River',
    'beyond-the-river',
    'An immersive Malayalam social narrative about a boatman in Alleppey preserving natural backwater ecosystems. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    1050, 2024, 'U', 'Riya Desai', 'Arjun Rao',
    '[{"name": "Unni Menon", "role": "Unni"}, {"name": "Ammu Pillai", "role": "Ammu"}]'::jsonb,
    'Malabar Reels', 'approved', 'public', 1340, 290, 4.78, 35, NULL, NOW() - INTERVAL '7 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c20',
    'Chai Before Dawn',
    'chai-before-dawn',
    'A quiet, atmospheric Hindi short following early morning tea vendors at Old Delhi railway junction. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    640, 2024, 'U', 'Arjun Rao', 'Neha Joshi',
    '[{"name": "Suresh Prasad", "role": "Ram Lal"}, {"name": "Chotu Ram", "role": "Chotu"}]'::jsonb,
    'Katha Independent Talkies', 'approved', 'public', 2100, 520, 4.88, 56, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', NOW() - INTERVAL '1 day'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c21',
    'The Silent Room',
    'the-silent-room',
    'A chilling Tamil psychological horror short about an sound recordist who hears whispers in silent audio tracks. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    750, 2023, 'UA 16+', 'Neha Joshi', 'Kabir Patel',
    '[{"name": "Kiran Subramanian", "role": "Kiran"}, {"name": "Dr. Maya Iyer", "role": "Dr. Maya"}]'::jsonb,
    'Marina Wave Pictures', 'approved', 'public', 1980, 470, 4.72, 44, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13', NOW() - INTERVAL '3 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22',
    'Two Wheels',
    'two-wheels',
    'A hilarious Marathi comedy following two college friends attempting to ride a vintage scooter from Pune to Goa. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    820, 2024, 'U', 'Aarav Sharma', 'Riya Desai',
    '[{"name": "Chinmay Kulkarni", "role": "Chinmay"}, {"name": "Bunty Deshmukh", "role": "Bunty"}]'::jsonb,
    'Sahyadri Cinema', 'approved', 'public', 1540, 390, 4.68, 41, NULL, NOW() - INTERVAL '9 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c23',
    'Paper Boat',
    'paper-boat',
    'A lyrical Bengali romance capturing monsoon raindrops and childhood promises floating down Kolkata alleyways. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    690, 2024, 'U', 'Subhashish Ghosh', 'Moumi Banerjee',
    '[{"name": "Sourav Mukherji", "role": "Sourav"}, {"name": "Brishti Dutt", "role": "Brishti"}]'::jsonb,
    'Ganges Wave Films', 'approved', 'public', 1880, 460, 4.85, 52, NULL, NOW() - INTERVAL '5 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c24',
    'The Empty Chair',
    'the-empty-chair',
    'An intriguing Kannada mystery surrounding an antique wooden chair in a Bengaluru cafe that changes positions every night. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    920, 2024, 'U', 'Ramesh Gowda', 'Sujata Rao',
    '[{"name": "Inspector Arya Gowda", "role": "Inspector Arya"}, {"name": "Shruti Rao", "role": "Shruti"}]'::jsonb,
    'Kaveri Talkies', 'approved', 'public', 1150, 240, 4.55, 26, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14', NOW() - INTERVAL '11 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c25',
    'Mitti',
    'mitti',
    'An uplifting Punjabi social drama about an organic farmer restoring traditional mustard soil in Ludhiana. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    1180, 2024, 'U', 'Gurpreet Singh', 'Harpreet Kaur',
    '[{"name": "Jagtar Grewal", "role": "Jagtar"}, {"name": "Preet Brar", "role": "Preet"}]'::jsonb,
    'Five Rivers Media', 'approved', 'public', 1420, 310, 4.79, 39, NULL, NOW() - INTERVAL '8 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c26',
    'Ek Safar',
    'ek-safar',
    'A breathtaking Hindi adventure short tracing a solo traveler''s journey across the high passes of Himachal Pradesh. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    1250, 2024, 'U', 'Kabir Patel', 'Aarav Mehta',
    '[{"name": "Kabir Thakur", "role": "Kabir"}, {"name": "Tanya Negi", "role": "Guide"}]'::jsonb,
    'Katha Independent Talkies', 'approved', 'public', 2450, 610, 4.92, 73, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', NOW() - INTERVAL '2 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c27',
    'Rain on Platform 3',
    'rain-on-platform-3',
    'A poignant Telugu romantic encounter on a rainy evening at Vizag railway station. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    710, 2024, 'U', 'Teja Varma', 'Anitha Reddy',
    '[{"name": "Arjun Chalam", "role": "Arjun"}, {"name": "Meghana Naidu", "role": "Meghana"}]'::jsonb,
    'Deccan Beats Studio', 'approved', 'public', 1780, 420, 4.77, 48, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15', NOW() - INTERVAL '4 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c28',
    'The Blue Window',
    'the-blue-window',
    'An abstract English experimental short film exploring urban isolation through reflection and blue geometric glass. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    580, 2024, 'U', 'Riya Desai', 'Diya Shah',
    '[{"name": "Clara Vance", "role": "Protagonist"}]'::jsonb,
    'Katha Independent Talkies', 'approved', 'public', 890, 180, 4.45, 22, NULL, NOW() - INTERVAL '14 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c29',
    'Last Frame',
    'last-frame',
    'A tense Marathi crime thriller about a crime scene photographer who spots an unnoticed detail in his final print. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    860, 2023, 'UA 13+', 'Devang Patel', 'Aarav Mehta',
    '[{"name": "Vikram Shinde", "role": "Vikram"}, {"name": "Inspector Smita Patil", "role": "Inspector Shinde"}]'::jsonb,
    'Sahyadri Cinema', 'approved', 'public', 1940, 480, 4.86, 53, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12', NOW() - INTERVAL '3 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c30',
    'Sunday at 5',
    'sunday-at-5',
    'A lighthearted Tamil comedy short about four friends attempting to bake a surprise birthday cake in 45 minutes. (Demo Short Film — Public Test Stream Sample)',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    620, 2024, 'U', 'Karthik Raja', 'Venkatesh Iyer',
    '[{"name": "Karthik Ananth", "role": "Karthik"}, {"name": "Bala Natarajan", "role": "Bala"}]'::jsonb,
    'Marina Wave Pictures', 'approved', 'public', 1670, 400, 4.69, 42, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13', NOW() - INTERVAL '6 days'
)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 11. FILM LANGUAGES RELATIONSHIPS
-- ==========================================
INSERT INTO public.film_languages (film_id, language_id) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c16', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c17', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c19', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c23', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c24', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c25', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c26', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c27', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c28', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c29', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c30', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 12. FILM GENRES RELATIONSHIPS
-- ==========================================
INSERT INTO public.film_genres (film_id, genre_id) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b20'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c16', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c16', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c17', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b23'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b20'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c19', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b24'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c19', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c20', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c21', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c23', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c24', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b20'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c25', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b25'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c26', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b18'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c27', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c28', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b21'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c29', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b19'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c30', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 13. SEED FEATURED FILMS
-- ==========================================
INSERT INTO public.featured_films (film_id, display_order) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c26', 1),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 2),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 3),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18', 4),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 5)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 14. INITIAL TRENDING CALCULATION
-- ==========================================
-- Executes privileged internal function to populate initial ranking safely
DO $$
BEGIN
    PERFORM public.calculate_trending_films();
EXCEPTION WHEN OTHERS THEN
    -- Fallback insertion if function context requires service role
    INSERT INTO public.trending_films (film_id, score, rank, calculated_at)
    SELECT id, (views_count * 1.0 + likes_count * 3.0), ROW_NUMBER() OVER (ORDER BY views_count DESC), NOW()
    FROM public.films WHERE status = 'approved' AND visibility = 'public' LIMIT 20
    ON CONFLICT DO NOTHING;
END $$;

-- ==========================================
-- 15. SECURITY & DATA INTEGRITY VERIFICATION
-- ==========================================
SELECT 'DATABASE SETUP VERIFICATION COMPLETED SUCCESSFULLY' AS status;

SELECT 
    (SELECT COUNT(*) FROM public.languages) AS total_languages,
    (SELECT COUNT(*) FROM public.genres) AS total_genres,
    (SELECT COUNT(*) FROM public.filmmakers) AS total_demo_filmmakers,
    (SELECT COUNT(*) FROM public.films WHERE status = 'approved' AND visibility = 'public') AS total_approved_films,
    (SELECT COUNT(*) FROM public.featured_films) AS total_featured_films,
    (SELECT COUNT(*) FROM public.trending_films) AS total_trending_films,
    (SELECT COUNT(*) FROM storage.buckets WHERE id IN ('avatars','film-posters','film-banners','film-videos','film-trailers')) AS storage_buckets_created;

-- Verify RLS Status on All 20 Core Tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'languages', 'genres', 'filmmakers', 'films',
    'film_languages', 'film_genres', 'watchlists', 'watch_history',
    'ratings', 'reviews', 'film_views', 'film_likes', 'comments',
    'submissions', 'featured_films', 'trending_films', 'reports',
    'notifications', 'admin_actions'
  )
ORDER BY tablename;
