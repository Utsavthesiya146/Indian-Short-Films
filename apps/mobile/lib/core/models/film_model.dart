class FilmModel {
  final String id;
  final String title;
  final String slug;
  final String description;
  final String posterUrl;
  final String? bannerUrl;
  final String videoUrl;
  final int durationSeconds;
  final int releaseYear;
  final String certificate;
  final String director;
  final double ratingAverage;
  final int ratingCount;
  final int viewsCount;
  final int likesCount;
  final String languageName;

  FilmModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.posterUrl,
    this.bannerUrl,
    required this.videoUrl,
    required this.durationSeconds,
    required this.releaseYear,
    required this.certificate,
    required this.director,
    required this.ratingAverage,
    required this.ratingCount,
    required this.viewsCount,
    required this.likesCount,
    required this.languageName,
  });

  static int _parseInt(dynamic value, {int defaultValue = 0}) {
    if (value == null) return defaultValue;
    if (value is int) return value;
    if (value is num) return value.toInt();
    if (value is String) return int.tryParse(value) ?? defaultValue;
    return defaultValue;
  }

  static double _parseDouble(dynamic value, {double defaultValue = 0.0}) {
    if (value == null) return defaultValue;
    if (value is double) return value;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? defaultValue;
    return defaultValue;
  }

  factory FilmModel.fromJson(Map<String, dynamic> json) {
    return FilmModel(
      id: (json['id'] ?? json['uuid'])?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
      description: (json['synopsis'] ?? json['description'])?.toString() ?? '',
      posterUrl: (json['posterUrl'] ?? json['poster_url'])?.toString() ?? '',
      bannerUrl: (json['backdropUrl'] ?? json['banner_url'] ?? json['bannerUrl'])?.toString(),
      videoUrl: (json['videoUrl'] ?? json['video_url'])?.toString() ?? '',
      durationSeconds: _parseInt(json['duration'] ?? json['duration_seconds']),
      releaseYear: _parseInt(json['releaseYear'] ?? json['release_year'], defaultValue: 2024),
      certificate: (json['certificate'] ?? json['genre'])?.toString() ?? 'U',
      director: json['director']?.toString() ?? '',
      ratingAverage: _parseDouble(json['rating'] ?? json['rating_average'] ?? json['ratingAverage']),
      ratingCount: _parseInt(json['ratingCount'] ?? json['rating_count']),
      viewsCount: _parseInt(json['viewsCount'] ?? json['views_count']),
      likesCount: _parseInt(json['likesCount'] ?? json['likes_count']),
      languageName: (json['language'] ?? json['languageName'] ?? json['language_name'])?.toString() ?? 'Hindi',
    );
  }


}
