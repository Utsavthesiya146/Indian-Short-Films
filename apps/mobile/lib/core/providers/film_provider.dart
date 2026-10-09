import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../models/film_model.dart';

final apiServiceProvider = Provider((ref) => ApiService());

final allFilmsProvider = FutureProvider<List<FilmModel>>((ref) async {
  final api = ref.read(apiServiceProvider);
  final data = await api.getFilms();
  return data.map((json) => FilmModel.fromJson(json)).toList();
});

final featuredFilmsProvider = FutureProvider<List<FilmModel>>((ref) async {
  final api = ref.read(apiServiceProvider);
  final data = await api.getFeaturedFilms();
  return data.map((json) => FilmModel.fromJson(json)).toList();
});

final trendingFilmsProvider = FutureProvider<List<FilmModel>>((ref) async {
  final api = ref.read(apiServiceProvider);
  final data = await api.getTrendingFilms();
  return data.map((json) => FilmModel.fromJson(json)).toList();
});

final watchlistProvider = FutureProvider<List<FilmModel>>((ref) async {
  final api = ref.read(apiServiceProvider);
  final data = await api.getUserWatchlist();
  return data.map((json) => FilmModel.fromJson(json)).toList();
});
