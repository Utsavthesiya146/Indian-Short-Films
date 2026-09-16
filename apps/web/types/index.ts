export type UserRole = 'user' | 'filmmaker' | 'admin' | 'moderator';

export type FilmStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
export type FilmVisibility = 'public' | 'private' | 'unlisted';
export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published';
export type CertificateType = 'U' | 'UA 7+' | 'UA 13+' | 'UA 16+' | 'A';
export type ReportTargetType = 'film' | 'review' | 'comment' | 'user';
export type ReportReason = 'copyright' | 'abusive' | 'hate_speech' | 'sexual' | 'violence' | 'spam' | 'misleading' | 'other';

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  native_name: string;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface Filmmaker {
  id: string;
  profile_id: string;
  profile?: Profile;
  bio?: string;
  location?: string;
  social_links?: Record<string, string>;
  awards?: Array<{ title: string; year: number; event: string }>;
  followers_count: number;
  total_views: number;
  is_verified: boolean;
  created_at: string;
}

export interface CastMember {
  name: string;
  role: string;
}

export interface Film {
  id: string;
  title: string;
  slug: string;
  description: string;
  poster_url: string;
  banner_url?: string;
  video_url: string;
  trailer_url?: string;
  duration_seconds: number;
  release_year: number;
  certificate: CertificateType;
  director: string;
  producer?: string;
  cast_members?: CastMember[];
  production_house?: string;
  status: FilmStatus;
  visibility: FilmVisibility;
  views_count: number;
  likes_count: number;
  rating_average: number;
  rating_count: number;
  filmmaker_id?: string;
  filmmaker?: Filmmaker;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  languages?: Language[];
  genres?: Genre[];
  is_in_watchlist?: boolean;
  is_liked?: boolean;
  user_rating?: number;
}

export interface Watchlist {
  id: string;
  user_id: string;
  film_id: string;
  film?: Film;
  created_at: string;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  film_id: string;
  film?: Film;
  last_position_seconds: number;
  duration_seconds: number;
  completion_percentage: number;
  updated_at: string;
}

export interface Rating {
  id: string;
  user_id: string;
  film_id: string;
  stars: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  profile?: Profile;
  film_id: string;
  content: string;
  rating_id?: string;
  stars?: number;
  likes_count: number;
  status: 'published' | 'hidden';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  film_id: string;
  user_id: string;
  profile?: Profile;
  parent_id?: string;
  content: string;
  status: 'published' | 'hidden';
  created_at: string;
}

export interface Submission {
  id: string;
  filmmaker_id: string;
  filmmaker?: Filmmaker;
  film_id?: string;
  title: string;
  description: string;
  poster_url: string;
  banner_url?: string;
  video_url: string;
  trailer_url?: string;
  language_id?: string;
  genre_ids?: string[];
  duration_seconds: number;
  release_year: number;
  director: string;
  producer?: string;
  cast_members?: CastMember[];
  production_house?: string;
  certificate?: string;
  content_warning?: string;
  status: SubmissionStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter?: Profile;
  target_type: ReportTargetType;
  target_id: string;
  reason: ReportReason;
  details?: string;
  status: 'pending' | 'resolved' | 'rejected';
  resolved_by?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalFilms: number;
  publishedFilms: number;
  pendingSubmissions: number;
  totalViews: number;
  totalReviews: number;
  totalFilmmakers: number;
  totalReports: number;
}
