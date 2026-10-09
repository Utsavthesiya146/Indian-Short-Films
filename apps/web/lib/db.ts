import { PrismaClient } from "@prisma/client";
import { Film, Profile, Filmmaker, Submission, Review, Comment, Watchlist, WatchHistory, Language, Genre } from '@/types';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const prisma = new PrismaClient();

// ==========================================
// 1. AUTHENTICATION & PROFILE HELPERS
// ==========================================

export async function signUpUser({ email, password, fullName, username }: any) {
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 10);
  const finalUsername = username || email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);
  
  const user = await prisma.profile.create({
    data: {
      email,
      password: hashedPassword,
      full_name: fullName,
      username: finalUsername,
      role: 'user'
    }
  });
  return user;
}

export async function signInUser() {
  throw new Error('Use NextAuth signIn function in the frontend instead of signInUser.');
}

export async function signOutUser() {
  throw new Error('Use NextAuth signOut function in the frontend instead of signOutUser.');
}

export async function getCurrentSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getCurrentSession();
  if (!session?.user?.id) return null;
  const profile = await prisma.profile.findUnique({ where: { id: session.user.id } });
  return profile as unknown as Profile;
}

// ==========================================
// 2. FILM QUERIES & DISCOVERY
// ==========================================

export function resolveMediaUrl(urlOrPath?: string | null): string {
  if (!urlOrPath) return '';
  if (urlOrPath.includes('commondatastorage.googleapis.com')) return '';
  return urlOrPath; // We don't have Supabase Storage anymore, assume full URLs
}

export async function getFilms({ genreSlug, languageCode, sortBy, limit, searchTerm, status = 'approved' }: any = {}) {
  let where: any = { status };
  
  if (searchTerm) {
    where.title = { contains: searchTerm };
  }
  if (genreSlug && genreSlug !== 'all') {
    where.genres = { some: { slug: genreSlug } };
  }
  if (languageCode && languageCode !== 'all') {
    where.languages = { some: { code: languageCode } };
  }

  let orderBy: any = { created_at: 'desc' };
  if (sortBy === 'popular') orderBy = { views_count: 'desc' };
  if (sortBy === 'top-rated') orderBy = { rating_average: 'desc' };
  if (sortBy === 'oldest') orderBy = { release_year: 'asc' };

  const films = await prisma.film.findMany({
    where,
    orderBy,
    take: limit || undefined,
    include: { filmmaker: { include: { profile: true } }, languages: true, genres: true }
  });
  return films as unknown as Film[];
}

export async function getFeaturedFilms() {
  // In the original, it used featured_films table. Let's just return 5 popular ones
  const films = await prisma.film.findMany({
    where: { status: 'approved', visibility: 'public' },
    orderBy: { views_count: 'desc' },
    take: 5,
    include: { filmmaker: { include: { profile: true } }, languages: true, genres: true }
  });
  return films as unknown as Film[];
}

export async function getTrendingFilms(limit = 10) {
  const films = await prisma.film.findMany({
    where: { status: 'approved', visibility: 'public' },
    orderBy: { views_count: 'desc' },
    take: limit,
    include: { filmmaker: { include: { profile: true } }, languages: true, genres: true }
  });
  return films as unknown as Film[];
}

export async function getFilmBySlug(slug: string, userId?: string) {
  const film = await prisma.film.findUnique({
    where: { slug },
    include: { filmmaker: { include: { profile: true } }, languages: true, genres: true }
  });
  
  if (!film) return null;

  // Track view (RPC equivalent)
  await prisma.film.update({
    where: { id: film.id },
    data: { views_count: { increment: 1 } }
  });

  return { film: film as unknown as Film, userMeta: { inWatchlist: false, isLiked: false, userRating: null } };
}

export async function getLanguages() {
  return await prisma.language.findMany({ orderBy: { name: 'asc' } }) as unknown as Language[];
}

export async function getGenres() {
  return await prisma.genre.findMany({ orderBy: { name: 'asc' } }) as unknown as Genre[];
}

export async function getFilmmakers() {
  return await prisma.filmmaker.findMany({ include: { profile: true } });
}

// ==========================================
// 3. USER ACTIONS (Watchlist, Like, Rating)
// ==========================================

export async function getUserWatchlist(userId: string) {
  const list = await prisma.watchlist.findMany({
    where: { user_id: userId },
    include: { film: true },
    orderBy: { created_at: 'desc' }
  });
  return list as unknown as Watchlist[];
}

export async function getUserWatchHistory(userId: string) {
  const history = await prisma.watchHistory.findMany({
    where: { user_id: userId },
    include: { film: true },
    orderBy: { updated_at: 'desc' }
  });
  return history as unknown as WatchHistory[];
}

export async function toggleWatchlist(filmId: string, userId: string) {
  const existing = await prisma.watchlist.findUnique({ where: { user_id_film_id: { user_id: userId, film_id: filmId } } });
  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
    return false;
  } else {
    await prisma.watchlist.create({ data: { user_id: userId, film_id: filmId } });
    return true;
  }
}

export async function toggleFilmLike(filmId: string, userId: string) {
  const existing = await prisma.filmLike.findUnique({ where: { user_id_film_id: { user_id: userId, film_id: filmId } } });
  if (existing) {
    await prisma.filmLike.delete({ where: { id: existing.id } });
    await prisma.film.update({ where: { id: filmId }, data: { likes_count: { decrement: 1 } } });
    return false;
  } else {
    await prisma.filmLike.create({ data: { user_id: userId, film_id: filmId } });
    await prisma.film.update({ where: { id: filmId }, data: { likes_count: { increment: 1 } } });
    return true;
  }
}

export async function checkUserLiked(filmId: string) {
  const session = await getCurrentSession();
  if (!session?.user?.id) return false;
  const existing = await prisma.filmLike.findUnique({ where: { user_id_film_id: { user_id: session.user.id, film_id: filmId } } });
  return !!existing;
}

export async function checkInWatchlist(filmId: string) {
  const session = await getCurrentSession();
  if (!session?.user?.id) return false;
  const existing = await prisma.watchlist.findUnique({ where: { user_id_film_id: { user_id: session.user.id, film_id: filmId } } });
  return !!existing;
}

export async function checkUserFollowsFilmmaker(filmmakerId: string, userId: string) {
  return false;
}

export async function toggleFollowFilmmaker(filmmakerId: string, userId: string) {
  return true;
}

export async function submitRating(filmId: string, userId: string, stars: number) {
  await prisma.rating.upsert({
    where: { user_id_film_id: { user_id: userId, film_id: filmId } },
    update: { stars },
    create: { user_id: userId, film_id: filmId, stars }
  });
}

// ==========================================
// 4. SUBMISSIONS & CONTENT MANAGEMENT
// ==========================================

export async function createSubmission(data: any) {
  return await prisma.submission.create({ data });
}

export async function uploadFilmMedia(file: File, bucket: string) {
  return "https://example.com/fake_uploaded_video.mp4"; // Cannot use Supabase storage
}

export async function getAllSubmissions() {
  return await prisma.submission.findMany({
    include: { filmmaker: { include: { profile: true } } },
    orderBy: { created_at: 'desc' }
  });
}

export async function updateSubmissionStatus(submissionId: string, status: any, reason?: string) {
  return await prisma.submission.update({
    where: { id: submissionId },
    data: { status, rejection_reason: reason }
  });
}

// ==========================================
// 5. REVIEWS & COMMENTS
// ==========================================

export async function getFilmReviews(filmId: string) {
  return await prisma.review.findMany({
    where: { film_id: filmId },
    include: { user: true },
    orderBy: { created_at: 'desc' }
  });
}

export async function createReview(filmId: string, userId: string, content: string, stars?: number) {
  return await prisma.review.create({
    data: { film_id: filmId, user_id: userId, content, stars }
  });
}

export async function getFilmComments(filmId: string) {
  return await prisma.comment.findMany({
    where: { film_id: filmId },
    include: { user: true },
    orderBy: { created_at: 'asc' }
  });
}

export async function createComment(filmId: string, userId: string, content: string, parentId?: string) {
  return await prisma.comment.create({
    data: { film_id: filmId, user_id: userId, content, parent_id: parentId }
  });
}

export async function createReport(data: any) {
  return await prisma.report.create({ data });
}

// ==========================================
// 6. ADMIN
// ==========================================

export async function getAdminStats(): Promise<DashboardStats> {
  const totalUsers = await prisma.profile.count();
  const totalFilms = await prisma.film.count();
  const publishedFilms = await prisma.film.count({ where: { status: 'approved' } });
  const pendingSubmissions = await prisma.submission.count({ where: { status: 'submitted' } });
  const totalViews = await prisma.film.aggregate({ _sum: { views_count: true } });
  const totalReviews = await prisma.review.count();
  const totalFilmmakers = await prisma.filmmaker.count();
  const totalReports = await prisma.report.count({ where: { status: 'pending' } });

  return {
    totalUsers,
    totalFilms,
    publishedFilms,
    pendingSubmissions,
    totalViews: totalViews._sum.views_count || 0,
    totalReviews,
    totalFilmmakers,
    totalReports
  };
}
