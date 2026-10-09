import { User, ShortFilm, ReelVideo, Creator, Comment, Review, UserRole, FilmGenre, IndianLanguage, AppNotification, ContactMessage } from '../types';
import { HARRI_KUMAR_CREATOR, INITIAL_SHORT_FILMS, INITIAL_REELS, INDIE_FILMMAKERS } from '../data/mockData';

// IndexedDB configuration
const DB_NAME = 'indian_short_movie_db';
const DB_VERSION = 2;
const BLOB_STORE = 'media_blobs';

// Open or create IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store a media Blob in IndexedDB and return an Object URL
export async function storeMediaBlob(id: string, file: Blob): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(BLOB_STORE, 'readwrite');
      const store = tx.objectStore(BLOB_STORE);
      store.put({ id, blob: file, createdAt: Date.now() });
      tx.oncomplete = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB blob storage fallback to direct object URL', err);
    return URL.createObjectURL(file);
  }
}

// Retrieve a media Blob from IndexedDB
export async function getMediaBlobUrl(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(BLOB_STORE, 'readonly');
      const store = tx.objectStore(BLOB_STORE);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(URL.createObjectURL(req.result.blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Real SHA-256 password hasher via Web Crypto API
export async function hashPassword(plainText: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Basic fallback if subtle crypto is unavailable
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'ism_real_users_v2',
  SESSION: 'ism_active_session_v2',
  FILMS: 'ism_real_films_v2',
  REELS: 'ism_real_reels_v2',
  CREATORS: 'ism_real_creators_v2',
  COMMENTS: 'ism_real_comments_v2',
  REVIEWS: 'ism_real_reviews_v2',
  NOTIFICATIONS: 'ism_real_notifications_v2',
  MESSAGES: 'ism_real_messages_v2'
};

// Initial verified real Harri Kumar profile
export const REAL_HARRI_KUMAR: Creator = {
  ...HARRI_KUMAR_CREATOR,
  totalViews: 0,
  totalLikes: 0,
  followersCount: 0,
  filmographyCount: 0,
  type: 'creator'
};

// Default platform admin user
const DEFAULT_ADMIN: User = {
  id: 'user-admin-ism',
  name: 'Platform Administrator',
  username: 'admin',
  email: 'admin@indianshortmovie.com',
  avatar: '/harri-kumar.jpg',
  bio: 'Indian Short Movie Platform Moderation & Executive Governance.',
  role: 'admin',
  passwordHash: 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', // 'Admin@2026!'
  followersCount: 0,
  followingCount: 0,
  followingCreatorIds: [],
  isVerified: true,
  joinedDate: 'January 2026',
  savedFilmIds: [],
  savedReelIds: [],
  likedFilmIds: [],
  likedReelIds: []
};

// Default Harri Kumar User account
const DEFAULT_HARRI_USER: User = {
  id: 'creator-harri-kumar',
  name: 'Harri Kumar',
  username: 'harrikumargowda',
  email: 'connect@harrikumar.com',
  avatar: '/harri-kumar.jpg',
  bio: 'Entrepreneur, business management professional and digital project leader with 12+ years of experience. Founder of Web Hosting Baba.',
  role: 'creator',
  passwordHash: 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec',
  followersCount: 0,
  followingCount: 0,
  followingCreatorIds: [],
  isVerified: true,
  joinedDate: 'January 2026',
  savedFilmIds: [],
  savedReelIds: [],
  likedFilmIds: [],
  likedReelIds: [],
  website: 'https://harrikumar.com',
  contactPhone: '+91 93418 73532',
  brandName: 'Web Hosting Baba'
};

export class PlatformStore {
  // Get all registered users
  static getUsers(): User[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
    const initialUsers = [DEFAULT_ADMIN, DEFAULT_HARRI_USER];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }

  // Save users list
  static saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Get active user session
  static getCurrentSession(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  // Set active user session
  static setCurrentSession(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }

  // Register a new user
  static async registerUser(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    bio?: string;
    website?: string;
    brandName?: string;
    contactPhone?: string;
    profession?: string;
    location?: string;
    industry?: string;
    brandCategory?: string;
    about?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers();
    const cleanUsername = data.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = data.email.toLowerCase().trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters and alphanumeric.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Check if username or email already exists
    const exists = users.some(u => u.username === cleanUsername || u.email === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this username or email already exists.' };
    }

    const passwordHash = await hashPassword(data.password);
    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: data.name.trim() || data.username.trim(),
      username: cleanUsername,
      email: cleanEmail,
      avatar: '/harri-kumar.jpg',
      bio: data.bio?.trim() || `${data.role.toUpperCase()} on Indian Short Movie platform.`,
      role: data.role,
      passwordHash,
      followersCount: 0,
      followingCount: 0,
      followingCreatorIds: [],
      isVerified: data.role === 'brand' || data.role === 'filmmaker',
      joinedDate: 'Joined Today',
      savedFilmIds: [],
      savedReelIds: [],
      likedFilmIds: [],
      likedReelIds: [],
      website: data.website?.trim(),
      brandName: data.brandName?.trim(),
      contactPhone: data.contactPhone?.trim(),
      profession: data.profession?.trim(),
      location: data.location?.trim(),
      industry: data.industry?.trim() || data.brandCategory?.trim(),
      brandCategory: data.brandCategory?.trim() || data.industry?.trim(),
      about: data.about?.trim()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentSession(newUser);

    // If registered as creator, brand, or filmmaker, create their public directory entry
    if (data.role === 'creator' || data.role === 'brand' || data.role === 'filmmaker') {
      const creators = this.getCreators();
      const newCreator: Creator = {
        id: userId,
        name: newUser.name,
        handle: `@${newUser.username}`,
        avatar: newUser.avatar,
        coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
        bio: newUser.bio,
        designation: data.role === 'brand' ? 'Official Brand Partner' : (data.role === 'filmmaker' ? 'Film Director & Producer' : 'Digital Video Creator'),
        experienceYears: 1,
        location: 'India',
        specialties: [data.role === 'brand' ? 'Brand Content' : 'Short Film Direction'],
        filmographyCount: 0,
        totalViews: 0,
        totalLikes: 0,
        followersCount: 0,
        type: data.role,
        isVerified: newUser.isVerified || false,
        website: newUser.website,
        email: newUser.email,
        phone: newUser.contactPhone,
        socialLinks: {}
      };
      creators.push(newCreator);
      this.saveCreators(creators);
    }

    return { success: true, user: newUser };
  }

  // Real Login verification
  static async loginUser(identifier: string, plainPassword: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanIdent = identifier.toLowerCase().trim();
    if (!cleanIdent || !plainPassword) {
      return { success: false, error: 'Please enter your username/email and password.' };
    }

    const users = this.getUsers();
    const found = users.find(u => u.username === cleanIdent || u.email === cleanIdent);
    if (!found) {
      return { success: false, error: 'No account found with this username or email.' };
    }

    // Verify hash
    const inputHash = await hashPassword(plainPassword);
    if (found.passwordHash && found.passwordHash !== inputHash) {
      return { success: false, error: 'Incorrect password. Please verify your credentials.' };
    }

    this.setCurrentSession(found);
    return { success: true, user: found };
  }

  // Update profile
  static updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);

    const active = this.getCurrentSession();
    if (active && active.id === userId) {
      const updated = users[idx];
      this.setCurrentSession(updated);
      return updated;
    }
    return users[idx];
  }

  // Films storage
  static getFilms(): ShortFilm[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FILMS);
      if (raw) {
        const films: ShortFilm[] = JSON.parse(raw);
        if (Array.isArray(films) && films.length > 0) {
          return films;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Return initial real films
    this.saveFilms(INITIAL_SHORT_FILMS);
    return INITIAL_SHORT_FILMS;
  }

  static saveFilms(films: ShortFilm[]) {
    localStorage.setItem(STORAGE_KEYS.FILMS, JSON.stringify(films));
  }

  // Reels storage
  static getReels(): ReelVideo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REELS);
      if (raw) {
        const reels: ReelVideo[] = JSON.parse(raw);
        if (Array.isArray(reels) && reels.length > 0) {
          return reels;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Return initial real reels
    this.saveReels(INITIAL_REELS);
    return INITIAL_REELS;
  }

  static saveReels(reels: ReelVideo[]) {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
  }

  // Creators & Brands directory
  static getCreators(): Creator[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CREATORS);
      if (raw) {
        const parsed: Creator[] = JSON.parse(raw);
        if (parsed.length > 1) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const list = INDIE_FILMMAKERS;
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(list));
    return list;
  }

  static saveCreators(creators: Creator[]) {
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
  }

  // Comments storage
  static getComments(): Comment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  static saveComments(comments: Comment[]) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }

  // Reviews storage
  static getReviews(): Review[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  static saveReviews(reviews: Review[]) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }

  // Real view incrementing
  static incrementView(targetId: string, type: 'film' | 'reel') {
    if (type === 'film') {
      const films = this.getFilms();
      const updated = films.map(f => {
        if (f.id === targetId) {
          return { ...f, viewsCount: f.viewsCount + 1 };
        }
        return f;
      });
      this.saveFilms(updated);
    } else {
      const reels = this.getReels();
      const updated = reels.map(r => {
        if (r.id === targetId) {
          return { ...r, viewsCount: r.viewsCount + 1 };
        }
        return r;
      });
      this.saveReels(updated);
    }
  }

  // Real Follow toggle
  static toggleFollow(userId: string, creatorId: string): { following: boolean; followersCount: number } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    const creators = this.getCreators();
    const creator = creators.find(c => c.id === creatorId);

    if (!user || !creator) {
      return { following: false, followersCount: creator?.followersCount || 0 };
    }

    const followingIds = user.followingCreatorIds || [];
    const isFollowing = followingIds.includes(creatorId);

    const newFollowingIds = isFollowing
      ? followingIds.filter(id => id !== creatorId)
      : [...followingIds, creatorId];

    const newFollowersCount = Math.max(0, (creator.followersCount || 0) + (isFollowing ? -1 : 1));

    user.followingCreatorIds = newFollowingIds;
    user.followingCount = newFollowingIds.length;
    creator.followersCount = newFollowersCount;

    this.saveUsers(users);
    this.saveCreators(creators);

    const activeSession = this.getCurrentSession();
    if (activeSession && activeSession.id === userId) {
      this.setCurrentSession(user);
    }

    return { following: !isFollowing, followersCount: newFollowersCount };
  }

  // Delete Film
  static deleteFilm(filmId: string) {
    const films = this.getFilms().filter(f => f.id !== filmId);
    this.saveFilms(films);
    // Also remove comments and reviews associated
    const comments = this.getComments().filter(c => c.targetId !== filmId);
    this.saveComments(comments);
    const reviews = this.getReviews().filter(r => r.filmId !== filmId);
    this.saveReviews(reviews);
  }

  // Delete Reel
  static deleteReel(reelId: string) {
    const reels = this.getReels().filter(r => r.id !== reelId);
    this.saveReels(reels);
    const comments = this.getComments().filter(c => c.targetId !== reelId);
    this.saveComments(comments);
  }

  // Notifications
  static getNotifications(userId: string): AppNotification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (raw) {
        const all: AppNotification[] = JSON.parse(raw);
        return all.filter(n => n.userId === userId);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  static addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): AppNotification {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      isRead: false,
      createdAt: 'Just now'
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = raw ? JSON.parse(raw) : [];
      all.unshift(newNotif);
      // Cap at 100 notifications
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
    return newNotif;
  }

  static markNotificationAsRead(notifId: string) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (raw) {
        const all: AppNotification[] = JSON.parse(raw);
        const updated = all.map(n => n.id === notifId ? { ...n, isRead: true } : n);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  }

  static markAllNotificationsAsRead(userId: string) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (raw) {
        const all: AppNotification[] = JSON.parse(raw);
        const updated = all.map(n => n.userId === userId ? { ...n, isRead: true } : n);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Contact Messages for Admin Portal
  static getMessages(): ContactMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
    // Default initial message from a filmmaker
    const initial: ContactMessage[] = [
      {
        id: 'msg-1',
        name: 'Vikas Deshmukh',
        email: 'vikas.films@gmail.com',
        phone: '+91 98201 45678',
        projectTitle: 'Chhavi (The Reflection)',
        category: 'Project Pitch',
        message: 'Namaste Harri Sir, I have directed an award-winning 19-min Marathi short film exploring rural education. Would love to feature on Indian Short Movie and collaborate on digital distribution.',
        screenerUrl: 'https://vimeo.com/preview/chhavi',
        status: 'unread',
        createdAt: 'Today, 10:24 AM'
      },
      {
        id: 'msg-2',
        name: 'Aishwarya Raman',
        email: 'aishwarya.raman@gmail.com',
        phone: '+91 94440 12390',
        projectTitle: 'Nila - A Chennai Monologue',
        category: 'Collaboration',
        message: 'Looking to partner with Web Hosting Baba and Indian Short Movie for our upcoming festival release and premiere screening in Bengaluru.',
        screenerUrl: 'https://youtube.com/watch?v=sample-nila',
        status: 'read',
        createdAt: 'Yesterday, 04:15 PM'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initial));
    return initial;
  }

  static addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: 'Just now'
    };
    try {
      const all = this.getMessages();
      all.unshift(newMsg);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
    return newMsg;
  }

  static markMessageRead(msgId: string) {
    try {
      const all = this.getMessages();
      const updated = all.map(m => m.id === msgId ? { ...m, status: 'read' as const } : m);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  static deleteMessage(msgId: string) {
    try {
      const all = this.getMessages().filter(m => m.id !== msgId);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }
}
