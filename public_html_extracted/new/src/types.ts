export type UserRole = 'viewer' | 'creator' | 'brand' | 'filmmaker' | 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: UserRole;
  passwordHash?: string;
  followersCount: number;
  followingCount: number;
  followingCreatorIds?: string[];
  isVerified?: boolean;
  joinedDate: string;
  savedFilmIds: string[];
  savedReelIds: string[];
  likedFilmIds: string[];
  likedReelIds: string[];
  website?: string;
  brandName?: string;
  contactPhone?: string;
  profession?: string;
  location?: string;
  industry?: string;
  brandCategory?: string;
  about?: string;
}

export type FilmGenre = 
  | 'Drama'
  | 'Thriller'
  | 'Mystery'
  | 'Comedy'
  | 'Romance'
  | 'Action'
  | 'Sci-Fi'
  | 'Folk Folklore'
  | 'Documentary'
  | 'Indie Experimental';

export type IndianLanguage = 
  | 'Hindi'
  | 'Kannada'
  | 'Tamil'
  | 'Telugu'
  | 'Malayalam'
  | 'Bengali'
  | 'Marathi'
  | 'Punjabi'
  | 'English';

export interface ShortFilm {
  id: string;
  title: string;
  description: string;
  synopsis: string;
  logline?: string;
  script?: string;
  videoUrl: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  duration: string; // e.g. "18 mins"
  durationSeconds: number;
  genre: FilmGenre;
  language: IndianLanguage;
  category: 'Short Film' | 'Documentary' | 'Animation' | 'Indie Spotlight' | 'Festival Winner';
  contentType?: 'short_film' | 'movie';
  director: string;
  producer?: string;
  cast: string[];
  crew?: string;
  productionHouse?: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  releaseYear: number;
  viewsCount: number;
  likesCount: number;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  isPopular?: boolean;
  status: 'approved' | 'pending' | 'rejected' | 'published' | 'draft' | 'changes_requested';
  adminNotes?: string;
  tags: string[];
  awards?: string[];
  subtitles?: string[];
  submittedAt?: string;
  isBrandContent?: boolean;
  brandName?: string;
  brandLogo?: string;
  brandWebsite?: string;
  brandCtaText?: string;
  brandCategory?: string;
}

export interface ReelVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  duration: string;
  musicTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  category: string;
  language: IndianLanguage;
  isBrandContent?: boolean;
  brandName?: string;
  brandWebsite?: string;
  brandCtaText?: string;
  brandCategory?: string;
}

export interface Comment {
  id: string;
  targetId: string; // film id or reel id
  targetType: 'film' | 'reel';
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Review {
  id: string;
  filmId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  headline: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  designation: string;
  experienceYears: number;
  location: string;
  specialties: string[];
  filmographyCount: number;
  totalViews: number;
  totalLikes: number;
  followersCount?: number;
  type?: 'creator' | 'brand' | 'filmmaker';
  isVerified: boolean;
  phone?: string;
  email?: string;
  website?: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    whatsapp?: string;
  };
  ventures?: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}

export interface FloorPlanZone {
  id: string;
  name: string;
  code: string;
  type: 'screening' | 'lounge' | 'studio' | 'red_carpet' | 'editing';
  capacity: number;
  dimensions: string;
  currentEvent: string;
  speakerOrHost: string;
  status: 'Active Screening' | 'Open Networking' | 'Reserved' | 'Live Session';
  description: string;
  features: string[];
  scheduleTime: string;
  color: string;
  x: number; // % coordinates for visual map
  y: number;
  width: number;
  height: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  type: 'like' | 'comment' | 'follow' | 'approval' | 'rejection' | 'welcome' | 'upload' | 'status_update';
  title?: string;
  message: string;
  targetId?: string;
  targetType?: 'film' | 'reel';
  thumbnail?: string;
  linkId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectTitle?: string;
  category: string;
  message: string;
  screenerUrl?: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}
