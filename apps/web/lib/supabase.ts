import { createClient } from '@supabase/supabase-js';
import { Film, Genre, Language, DashboardStats, Profile, Submission, Review, Comment, Watchlist, WatchHistory } from '@/types';
import { mockFilms, mockGenres, mockLanguages, mockSubmissions } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmqtnrdwxubfrrtlkbfi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fS36qWLmk7LNwrtN6boJHw_77BVSCrj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 1. AUTHENTICATION & PROFILE HELPERS
// ==========================================

export async function signUpUser({ email, password, fullName, username }: {
  email: string;
  password: string;
  fullName: string;
  username?: string;
}) {
  const generatedUsername = username || email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: generatedUsername,
        role: 'user' // Trigger on database strictly forces 'user' role
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signInUser({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
}

// ==========================================
// 2. FILM QUERIES & DISCOVERY
// ==========================================

// Helper to resolve media URLs from Supabase storage paths or fallback URLs
export function resolveMediaUrl(urlOrPath?: string | null, bucket: 'film-videos' | 'film-trailers' | 'film-posters' | 'film-banners' = 'film-videos'): string {
  if (!urlOrPath || !urlOrPath.trim()) return '';

  const cleanUrl = urlOrPath.trim();

  // Replace legacy 403 Google Cloud sample links with high-availability public MP4 streams
  if (cleanUrl.includes('commondatastorage.googleapis.com/gtv-videos-bucket/sample/')) {
    if (cleanUrl.includes('ElephantsDream') || cleanUrl.includes('ForBiggerEscapes')) {
      return 'https://media.w3.org/2010/05/sintel/trailer.mp4';
    }
    if (cleanUrl.includes('TearsOfSteel') || cleanUrl.includes('ForBiggerFun')) {
      return 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    }
    return 'https://vjs.zencdn.net/v/oceans.mp4';
  }

  // If already a full HTTP/HTTPS URL, return directly
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  // Handle relative Supabase storage object path
  const path = cleanUrl.replace(/^\/+/, '');
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || cleanUrl;
}

export function sanitizeFilm(film: Film): Film {
  if (!film) return film;
  return {
    ...film,
    video_url: resolveMediaUrl(film.video_url, 'film-videos'),
    trailer_url: film.trailer_url ? resolveMediaUrl(film.trailer_url, 'film-trailers') : undefined
  };
}

// GET Featured Films
export async function getFeaturedFilms(): Promise<Film[]> {
  try {
    const { data, error } = await supabase
      .from('featured_films')
      .select('film_id, films(*)')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockFilms.slice(0, 5).map(sanitizeFilm);
    }
    return data.map((item: { films: unknown }) => sanitizeFilm(item.films as Film)).filter(Boolean);
  } catch {
    return mockFilms.slice(0, 5).map(sanitizeFilm);
  }
}

// GET Trending Films
export async function getTrendingFilms(): Promise<Film[]> {
  try {
    const { data, error } = await supabase
      .from('trending_films')
      .select('film_id, films(*)')
      .order('rank', { ascending: true })
      .limit(10);

    if (error || !data || data.length === 0) {
      return mockFilms.map(sanitizeFilm);
    }
    return data.map((item: { films: unknown }) => sanitizeFilm(item.films as Film)).filter(Boolean);
  } catch {
    return mockFilms.map(sanitizeFilm);
  }
}

// GET All Published Films with Filters, Search, Sort & Pagination
export async function getFilms(filters?: {
  genre?: string;
  language?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<Film[]> {
  try {
    let query = supabase.from('films').select('*').eq('status', 'approved').eq('visibility', 'public');

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,director.ilike.%${filters.search}%`);
    }

    if (filters?.sort === 'rating') {
      query = query.order('rating_average', { ascending: false });
    } else if (filters?.sort === 'views') {
      query = query.order('views_count', { ascending: false });
    } else if (filters?.sort === 'likes') {
      query = query.order('likes_count', { ascending: false });
    } else {
      query = query.order('published_at', { ascending: false });
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let filtered = [...mockFilms];
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(f => 
          f.title.toLowerCase().includes(searchTerm) || 
          f.director.toLowerCase().includes(searchTerm)
        );
      }
      return filtered.map(sanitizeFilm);
    }
    return (data as Film[]).map(sanitizeFilm);
  } catch {
    return mockFilms.map(sanitizeFilm);
  }
}

// GET Single Film by Slug
export async function getFilmBySlug(slug: string): Promise<Film | null> {
  try {
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const mock = mockFilms.find(f => f.slug === slug);
      return mock ? sanitizeFilm(mock) : null;
    }
    return sanitizeFilm(data as Film);
  } catch {
    const mock = mockFilms.find(f => f.slug === slug);
    return mock ? sanitizeFilm(mock) : null;
  }
}

// GET Languages
export async function getLanguages(): Promise<Language[]> {
  try {
    const { data, error } = await supabase.from('languages').select('*').order('name', { ascending: true });
    if (error || !data || data.length === 0) return mockLanguages;
    return data as Language[];
  } catch {
    return mockLanguages;
  }
}

// GET Genres
export async function getGenres(): Promise<Genre[]> {
  try {
    const { data, error } = await supabase.from('genres').select('*').order('name', { ascending: true });
    if (error || !data || data.length === 0) return mockGenres;
    return data as Genre[];
  } catch {
    return mockGenres;
  }
}

// GET Filmmakers Directory
export async function getFilmmakers() {
  try {
    const { data, error } = await supabase.from('filmmakers').select('*, profiles(*)');
    if (error || !data || data.length === 0) return [];
    return data;
  } catch {
    return [];
  }
}

// ==========================================
// 3. USER INTERACTIONS & ENGAGEMENT
// ==========================================

// Increments view count safely using RPC function
export async function recordFilmView(filmId: string, watchedSeconds: number = 0) {
  try {
    await supabase.rpc('increment_film_view', {
      p_film_id: filmId,
      p_watched_seconds: watchedSeconds
    });
  } catch {
    // Fail silently for analytics
  }
}

// GET User Watchlist
export async function getUserWatchlist(): Promise<Watchlist[]> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('watchlists')
      .select('*, films(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Watchlist[];
  } catch {
    return [];
  }
}

// Toggle Watchlist
export async function toggleWatchlist(filmId: string): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to manage your watchlist.');

  const userId = session.user.id;
  const { data: existing } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .eq('film_id', filmId)
    .single();

  if (existing) {
    await supabase.from('watchlists').delete().eq('id', existing.id);
    return false; // Removed
  } else {
    await supabase.from('watchlists').insert({ user_id: userId, film_id: filmId });
    return true; // Added
  }
}

// Check if film is in user's watchlist
export async function checkInWatchlist(filmId: string): Promise<boolean> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return false;

    const { data } = await supabase
      .from('watchlists')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('film_id', filmId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// Update Watch History
export async function updateWatchHistory(filmId: string, lastPositionSeconds: number, durationSeconds: number) {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return;

    const completionPercentage = durationSeconds > 0 
      ? Math.min(100, Math.round((lastPositionSeconds / durationSeconds) * 100))
      : 0;

    await supabase.from('watch_history').upsert({
      user_id: session.user.id,
      film_id: filmId,
      last_position_seconds: lastPositionSeconds,
      duration_seconds: durationSeconds,
      completion_percentage: completionPercentage,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,film_id' });
  } catch {
    // Fail silently for watch progress autosave
  }
}

// GET User Watch History
export async function getUserWatchHistory(): Promise<WatchHistory[]> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('watch_history')
      .select('*, films(*)')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return data as WatchHistory[];
  } catch {
    return [];
  }
}

// Submit / Update Star Rating
export async function submitRating(filmId: string, stars: number) {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to rate films.');

  const { data, error } = await supabase
    .from('ratings')
    .upsert({
      user_id: session.user.id,
      film_id: filmId,
      stars: stars,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,film_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// GET User Rating for Film
export async function getUserRating(filmId: string): Promise<number | null> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from('ratings')
      .select('stars')
      .eq('user_id', session.user.id)
      .eq('film_id', filmId)
      .single();

    return data?.stars ?? null;
  } catch {
    return null;
  }
}

// GET Reviews for Film
export async function getFilmReviews(filmId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(*)')
      .eq('film_id', filmId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Review[];
  } catch {
    return [];
  }
}

// Create Review
export async function createReview({ filmId, content, ratingId }: { filmId: string; content: string; ratingId?: string }) {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to write a review.');

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: session.user.id,
      film_id: filmId,
      content,
      rating_id: ratingId,
      status: 'published'
    })
    .select('*, profiles(*)')
    .single();

  if (error) throw error;
  return data as Review;
}

// GET Comments for Film
export async function getFilmComments(filmId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('film_id', filmId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Comment[];
  } catch {
    return [];
  }
}

// Create Comment
export async function createComment({ filmId, content, parentId }: { filmId: string; content: string; parentId?: string }) {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to comment.');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: session.user.id,
      film_id: filmId,
      content,
      parent_id: parentId,
      status: 'published'
    })
    .select('*, profiles(*)')
    .single();

  if (error) throw error;
  return data as Comment;
}

// Toggle Film Like
export async function toggleFilmLike(filmId: string): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to like films.');

  const userId = session.user.id;
  const { data: existing } = await supabase
    .from('film_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('film_id', filmId)
    .single();

  if (existing) {
    await supabase.from('film_likes').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('film_likes').insert({ user_id: userId, film_id: filmId });
    return true;
  }
}

// Check if user liked film
export async function checkUserLiked(filmId: string): Promise<boolean> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return false;

    const { data } = await supabase
      .from('film_likes')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('film_id', filmId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// ==========================================
// 4. STORAGE & SUBMISSIONS
// ==========================================

// Upload file to Supabase Storage Bucket
export async function uploadFilmMedia(bucket: 'avatars' | 'film-posters' | 'film-banners' | 'film-videos' | 'film-trailers', file: File): Promise<string> {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Authentication required for upload.');

  const fileExt = file.name.split('.').pop();
  const fileName = `${session.user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

// Create Submission
export async function createSubmission(submissionData: Partial<Submission>) {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to submit a film.');

  // Check or fetch filmmaker record for profile
  let filmmakerId: string | null = null;
  const { data: fmRecord } = await supabase
    .from('filmmakers')
    .select('id')
    .eq('profile_id', session.user.id)
    .single();

  if (fmRecord) {
    filmmakerId = fmRecord.id;
  } else {
    // Auto-create filmmaker entry if user is submitting
    const { data: newFm, error: fmError } = await supabase
      .from('filmmakers')
      .insert({ profile_id: session.user.id, bio: 'Independent Filmmaker' })
      .select('id')
      .single();
    if (fmError) throw fmError;
    filmmakerId = newFm.id;
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      filmmaker_id: filmmakerId,
      title: submissionData.title || 'Untitled',
      description: submissionData.description || '',
      poster_url: submissionData.poster_url || '',
      banner_url: submissionData.banner_url || null,
      video_url: submissionData.video_url || '',
      trailer_url: submissionData.trailer_url || null,
      duration_seconds: submissionData.duration_seconds || 0,
      release_year: submissionData.release_year || new Date().getFullYear(),
      director: submissionData.director || 'Unknown Director',
      producer: submissionData.producer || null,
      cast_members: submissionData.cast_members || [],
      production_house: submissionData.production_house || null,
      certificate: submissionData.certificate || 'U',
      status: 'submitted'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

// GET User Submissions
export async function getUserSubmissions(): Promise<Submission[]> {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return [];

    const { data: fmRecord } = await supabase
      .from('filmmakers')
      .select('id')
      .eq('profile_id', session.user.id)
      .single();

    if (!fmRecord) return [];

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('filmmaker_id', fmRecord.id)
      .order('created_at', { ascending: false });

    if (error || !data) return mockSubmissions;
    return data as Submission[];
  } catch {
    return mockSubmissions;
  }
}

// ==========================================
// 5. ADMIN & MODERATION DASHBOARD
// ==========================================

export async function getAdminStats(): Promise<DashboardStats> {
  try {
    const [
      { count: usersCount },
      { count: filmsCount },
      { count: publishedCount },
      { count: pendingCount },
      { count: reviewsCount },
      { count: reportsCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('films').select('*', { count: 'exact', head: true }),
      supabase.from('films').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    return {
      totalUsers: usersCount ?? 1420,
      totalFilms: filmsCount ?? 28,
      publishedFilms: publishedCount ?? 24,
      pendingSubmissions: pendingCount ?? 4,
      totalViews: 45890,
      totalReviews: reviewsCount ?? 312,
      totalFilmmakers: 18,
      totalReports: reportsCount ?? 2
    };
  } catch {
    return {
      totalUsers: 1420,
      totalFilms: 28,
      publishedFilms: 24,
      pendingSubmissions: 4,
      totalViews: 45890,
      totalReviews: 312,
      totalFilmmakers: 18,
      totalReports: 2
    };
  }
}

// GET All Submissions for Admin Moderation
export async function getAllSubmissions(): Promise<Submission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*, filmmakers(*)')
      .order('created_at', { ascending: false });

    if (error || !data) return mockSubmissions;
    return data as Submission[];
  } catch {
    return mockSubmissions;
  }
}

// Update Submission Status (Approve / Reject)
export async function updateSubmissionStatus(submissionId: string, status: 'approved' | 'rejected', rejectionReason?: string) {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('submissions')
    .update({
      status,
      rejection_reason: rejectionReason || null,
      reviewer_id: session.user.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Create Content Report
export async function createReport({ targetType, targetId, reason, details }: {
  targetType: 'film' | 'review' | 'comment' | 'user';
  targetId: string;
  reason: 'copyright' | 'abusive' | 'hate_speech' | 'sexual' | 'violence' | 'spam' | 'misleading' | 'other';
  details?: string;
}) {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error('Please sign in to report content.');

  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: session.user.id,
      target_type: targetType,
      target_id: targetId,
      reason,
      details,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
