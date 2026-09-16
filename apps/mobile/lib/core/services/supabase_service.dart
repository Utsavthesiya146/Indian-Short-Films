import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/film_model.dart';

class SupabaseService {
  final SupabaseClient client = Supabase.instance.client;

  // Auth state listener
  Stream<AuthState> get authStateChanges => client.auth.onAuthStateChange;

  // Current user / session
  User? get currentUser => client.auth.currentUser;

  // 1. Auth Methods
  Future<AuthResponse> signIn({required String email, required String password}) async {
    return await client.auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> signUp({
    required String email,
    required String password,
    required String fullName,
  }) async {
    return await client.auth.signUp(
      email: email,
      password: password,
      data: {'full_name': fullName, 'role': 'user'},
    );
  }

  Future<void> signOut() async {
    await client.auth.signOut();
  }

  // 2. Film Queries
  Future<List<Map<String, dynamic>>> getFilms({
    String? search,
    String? genre,
    String? language,
    int limit = 20,
  }) async {
    try {
      var query = client.from('films').select('*').eq('status', 'approved').eq('visibility', 'public');

      if (search != null && search.isNotEmpty) {
        query = query.or('title.ilike.%$search%,director.ilike.%$search%');
      }

      final response = await query.order('published_at', ascending: false).limit(limit);
      return List<Map<String, dynamic>>.from(response);
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getFeaturedFilms() async {
    try {
      final response = await client
          .from('featured_films')
          .select('film_id, films(*)')
          .order('display_order', ascending: true);

      return (response as List).map((item) => item['films'] as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getTrendingFilms() async {
    try {
      final response = await client
          .from('trending_films')
          .select('film_id, films(*)')
          .order('rank', ascending: true)
          .limit(10);

      return (response as List).map((item) => item['films'] as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  // Profile Auto-Healing
  Future<void> ensureProfileExists() async {
    final user = currentUser;
    if (user == null) return;
    try {
      final existing = await client
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

      if (existing == null) {
        final emailName = user.email != null ? user.email!.split('@')[0] : 'user';
        final fullName = user.userMetadata?['full_name'] ?? emailName;
        final username = user.userMetadata?['username'] ?? '${emailName}_${DateTime.now().millisecondsSinceEpoch % 10000}';

        await client.from('profiles').upsert({
          'id': user.id,
          'email': user.email ?? '',
          'full_name': fullName,
          'username': username,
          'role': 'user',
          'updated_at': DateTime.now().toIso8601String(),
        }, onConflict: 'id');
      }
    } catch (_) {
      // Fail silently
    }
  }

  // 3. Watchlist
  Future<List<Map<String, dynamic>>> getUserWatchlist() async {
    final user = currentUser;
    if (user == null) return [];

    try {
      final response = await client
          .from('watchlists')
          .select('*, films(*)')
          .eq('user_id', user.id)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (_) {
      return [];
    }
  }

  Future<bool> toggleWatchlist(String filmId) async {
    final user = currentUser;
    if (user == null) throw Exception('User must be signed in.');
    await ensureProfileExists();

    final existing = await client
        .from('watchlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('film_id', filmId)
        .maybeSingle();

    if (existing != null) {
      await client.from('watchlists').delete().eq('id', existing['id']);
      return false;
    } else {
      await client.from('watchlists').insert({'user_id': user.id, 'film_id': filmId});
      return true;
    }
  }

  // 4. Ratings, Reviews & Likes
  Future<void> submitRating(String filmId, int stars) async {
    final user = currentUser;
    if (user == null) throw Exception('User must be signed in.');
    await ensureProfileExists();

    await client.from('ratings').upsert({
      'user_id': user.id,
      'film_id': filmId,
      'stars': stars,
      'updated_at': DateTime.now().toIso8601String(),
    }, onConflict: 'user_id,film_id');
  }

  Future<bool> toggleLike(String filmId) async {
    final user = currentUser;
    if (user == null) throw Exception('User must be signed in.');
    await ensureProfileExists();

    final existing = await client
        .from('film_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('film_id', filmId)
        .maybeSingle();

    if (existing != null) {
      await client.from('film_likes').delete().eq('id', existing['id']);
      return false;
    } else {
      await client.from('film_likes').insert({'user_id': user.id, 'film_id': filmId});
      return true;
    }
  }

  Future<void> createReview({required String filmId, required String content, int? stars}) async {
    final user = currentUser;
    if (user == null) throw Exception('User must be signed in.');
    await ensureProfileExists();

    if (stars != null) {
      try {
        await submitRating(filmId, stars);
      } catch (_) {}
    }

    await client.from('reviews').insert({
      'user_id': user.id,
      'film_id': filmId,
      'content': content,
      'status': 'published',
    });
  }

  Future<void> createComment({required String filmId, required String content}) async {
    final user = currentUser;
    if (user == null) throw Exception('User must be signed in.');
    await ensureProfileExists();

    await client.from('comments').insert({
      'user_id': user.id,
      'film_id': filmId,
      'content': content,
      'status': 'published',
    });
  }
}
