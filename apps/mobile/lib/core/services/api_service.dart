import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

class ApiService {
  static const String sessionCookieKey = 'php_session_cookie';

  // Get headers including session cookie
  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString(sessionCookieKey);
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (cookie != null) 'Cookie': cookie,
    };
  }

  // Update session cookie and user from response
  Future<void> _updateCookieAndUser(http.Response response) async {
    final rawCookie = response.headers['set-cookie'];
    final prefs = await SharedPreferences.getInstance();
    if (rawCookie != null) {
      await prefs.setString(sessionCookieKey, rawCookie);
    }
    try {
      final data = jsonDecode(response.body);
      if (data['user'] != null) {
        await prefs.setString('current_user', jsonEncode(data['user']));
      }
    } catch (_) {}
  }

  Map<String, dynamic>? get currentUser {
    // Read from memory or pref? Needs async.
    // A quick hack is to read synchronous from prefs if we hold it memory.
    // But let's fetch it via Future or expect caller to await.
    return null; // Implemented below
  }

  Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('current_user');
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }

  // 1. Auth Methods
  Future<Map<String, dynamic>> signIn({required String email, required String password}) async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_login.php');
    final response = await http.post(
      url,
      headers: await _getHeaders(),
      body: jsonEncode({'email': email, 'password': password}),
    );
    await _updateCookieAndUser(response);
    final data = jsonDecode(response.body);
    if (response.statusCode != 200 || data['error'] != null) {
      throw Exception(data['error'] ?? 'Failed to sign in');
    }
    return data;
  }

  Future<Map<String, dynamic>> signUp({
    required String email,
    required String password,
    required String fullName,
  }) async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_register.php');
    final response = await http.post(
      url,
      headers: await _getHeaders(),
      body: jsonEncode({'email': email, 'password': password, 'name': fullName}),
    );
    await _updateCookieAndUser(response);
    final data = jsonDecode(response.body);
    if (response.statusCode != 200 || data['error'] != null) {
      throw Exception(data['error'] ?? 'Failed to sign up');
    }
    return data;
  }

  Future<void> signOut() async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}logout.php');
    await http.get(url, headers: await _getHeaders());
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(sessionCookieKey);
    await prefs.remove('current_user');
  }

  Future<bool> checkSession() async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_check_session.php');
    try {
      final response = await http.get(url, headers: await _getHeaders());
      final data = jsonDecode(response.body);
      return data['active'] == true || data['loggedIn'] == true;
    } catch (_) {
      return false;
    }
  }

  // 2. Film Queries
  Future<List<Map<String, dynamic>>> getFilms({
    String? search,
    String? genre,
    String? language,
  }) async {
    try {
      final url = Uri.parse('${ApiConstants.currentBaseUrl}api_get_films.php');
      final response = await http.get(url, headers: await _getHeaders());
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        var films = data.map((json) {
          final f = Map<String, dynamic>.from(json);
          // Convert relative URLs to absolute URLs using ApiConstants.currentBaseUrl or domain
          final domain = ApiConstants.currentBaseUrl.replaceAll('/php/', '/');
          
          String videoUrl = f['videoUrl']?.toString() ?? '';
          if (videoUrl.isNotEmpty && !videoUrl.startsWith('http')) {
            f['videoUrl'] = '$domain$videoUrl';
          }
          
          String posterUrl = f['posterUrl']?.toString() ?? '';
          if (posterUrl.isNotEmpty && !posterUrl.startsWith('http')) {
            f['posterUrl'] = '$domain$posterUrl';
          }
          
          String backdropUrl = f['backdropUrl']?.toString() ?? '';
          if (backdropUrl.isNotEmpty && !backdropUrl.startsWith('http')) {
            f['backdropUrl'] = '$domain$backdropUrl';
          }
          
          return f;
        }).toList();
        
        if (search != null && search.isNotEmpty) {
          films = films.where((f) => 
            (f['title'] ?? '').toString().toLowerCase().contains(search.toLowerCase()) ||
            (f['director'] ?? '').toString().toLowerCase().contains(search.toLowerCase())
          ).toList();
        }
        if (genre != null && genre.isNotEmpty) {
          films = films.where((f) => (f['genre'] ?? '') == genre).toList();
        }
        if (language != null && language.isNotEmpty && language != 'All Languages') {
          films = films.where((f) => (f['language'] ?? '') == language).toList();
        }
        return films;
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getFeaturedFilms() async {
    final films = await getFilms();
    return films.where((f) => f['isFeatured'] == true).toList();
  }

  Future<List<Map<String, dynamic>>> getTrendingFilms() async {
    final films = await getFilms();
    films.sort((a, b) => (b['viewsCount'] ?? 0).compareTo(a['viewsCount'] ?? 0));
    return films.take(10).toList();
  }

  Future<List<Map<String, dynamic>>> getUserWatchlist() async {
    try {
      final url = Uri.parse('${ApiConstants.currentBaseUrl}api_get_watchlist.php');
      final response = await http.get(url, headers: await _getHeaders());
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) {
          final f = Map<String, dynamic>.from(json);
          final domain = ApiConstants.currentBaseUrl.replaceAll('/php/', '/');
          
          String videoUrl = f['videoUrl']?.toString() ?? '';
          if (videoUrl.isNotEmpty && !videoUrl.startsWith('http')) {
            f['videoUrl'] = '$domain$videoUrl';
          }
          
          String posterUrl = f['posterUrl']?.toString() ?? '';
          if (posterUrl.isNotEmpty && !posterUrl.startsWith('http')) {
            f['posterUrl'] = '$domain$posterUrl';
          }
          
          String backdropUrl = f['backdropUrl']?.toString() ?? '';
          if (backdropUrl.isNotEmpty && !backdropUrl.startsWith('http')) {
            f['backdropUrl'] = '$domain$backdropUrl';
          }
          
          return f;
        }).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<bool> toggleWatchlist(String filmId) async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_add_watchlist.php');
    final response = await http.post(
      url,
      headers: await _getHeaders(),
      body: jsonEncode({'film_id': filmId}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200 || data['error'] != null) {
      throw Exception(data['error'] ?? 'Failed to update watchlist');
    }
    return data['inWatchlist'] ?? false;
  }

  Future<void> submitRating(String filmId, int stars) async {
    // Rating is submitted as part of the review API
  }

  Future<bool> toggleLike(String filmId) async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_toggle_like.php');
    final response = await http.post(
      url,
      headers: await _getHeaders(),
      body: jsonEncode({'film_id': filmId}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200 || data['error'] != null) {
      throw Exception(data['error'] ?? 'Failed to toggle like');
    }
    return data['liked'] ?? false;
  }

  Future<void> createReview({required String filmId, required String content, int? stars}) async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_submit_review.php');
    final response = await http.post(
      url,
      headers: await _getHeaders(),
      body: jsonEncode({
        'film_id': filmId,
        'content': content,
        'stars': stars ?? 5,
      }),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200 || data['error'] != null) {
      throw Exception(data['error'] ?? 'Failed to submit review');
    }
  }

  Future<void> submitFilm({
    required String title,
    required String director,
    required String description,
    required String videoUrl,
    required String posterUrl,
  }) async {
    final url = Uri.parse('${ApiConstants.currentBaseUrl}api_submit_film.php');
    final response = await http.post(
      url,
      headers: await _getHeaders(),
      body: jsonEncode({
        'title': title,
        'director': director,
        'description': description,
        'video_url': videoUrl,
        'poster_url': posterUrl,
      }),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200 || data['error'] != null) {
      throw Exception(data['error'] ?? 'Failed to submit film');
    }
  }
}
