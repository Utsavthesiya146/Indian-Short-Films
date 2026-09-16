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

  factory FilmModel.fromJson(Map<String, dynamic> json) {
    return FilmModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'] ?? '',
      posterUrl: json['poster_url'] ?? '',
      bannerUrl: json['banner_url'],
      videoUrl: json['video_url'] ?? '',
      durationSeconds: json['duration_seconds'] ?? 0,
      releaseYear: json['release_year'] ?? 2024,
      certificate: json['certificate'] ?? 'U',
      director: json['director'] ?? '',
      ratingAverage: (json['rating_average'] as num?)?.toDouble() ?? 0.0,
      ratingCount: json['rating_count'] ?? 0,
      viewsCount: json['views_count'] ?? 0,
      likesCount: json['likes_count'] ?? 0,
      languageName: json['language_name'] ?? 'Hindi',
    );
  }

  static List<FilmModel> get sampleFilms => [
        FilmModel(
          id: 'f1',
          title: 'Chai & Stories (चाय और किस्से)',
          slug: 'chai-and-stories',
          description:
              'A poignant tale set in a bustling Mumbai tea stall where two strangers discover an unexpected connection over evening masala chai.',
          posterUrl:
              'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
          bannerUrl:
              'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
          videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          durationSeconds: 720,
          releaseYear: 2024,
          certificate: 'U',
          director: 'Aarav Sharma',
          ratingAverage: 4.8,
          ratingCount: 45,
          viewsCount: 1450,
          likesCount: 320,
          languageName: 'Hindi',
        ),
        FilmModel(
          id: 'f2',
          title: 'The Last Letter (અંતિમ પત્ર)',
          slug: 'the-last-letter',
          description:
              'A nostalgic Gujarati short film exploring an elderly artisan\'s journey through forgotten letters in vintage Ahmedabad.',
          posterUrl:
              'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
          bannerUrl:
              'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
          videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          durationSeconds: 950,
          releaseYear: 2024,
          certificate: 'U',
          director: 'Devang Patel',
          ratingAverage: 4.65,
          ratingCount: 28,
          viewsCount: 980,
          likesCount: 210,
          languageName: 'Gujarati',
        ),
        FilmModel(
          id: 'f3',
          title: 'Midnight Express (இரவு பயணம்)',
          slug: 'midnight-express',
          description:
              'A gripping Tamil psychological thriller centered around a late-night commuter in Chennai who notices a mysterious suitcase.',
          posterUrl:
              'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          bannerUrl:
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
          videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          durationSeconds: 840,
          releaseYear: 2023,
          certificate: 'UA 13+',
          director: 'Karthik Raja',
          ratingAverage: 4.9,
          ratingCount: 62,
          viewsCount: 2300,
          likesCount: 540,
          languageName: 'Tamil',
        ),
      ];
}
