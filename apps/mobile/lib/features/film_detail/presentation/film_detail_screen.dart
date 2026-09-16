import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/models/film_model.dart';
import '../../../../core/services/supabase_service.dart';

class FilmDetailScreen extends StatefulWidget {
  final FilmModel film;

  const FilmDetailScreen({super.key, required this.film});

  @override
  State<FilmDetailScreen> createState() => _FilmDetailScreenState();
}

class _FilmDetailScreenState extends State<FilmDetailScreen> {
  final SupabaseService _supabaseService = SupabaseService();
  final TextEditingController _reviewController = TextEditingController();

  bool _isLiked = false;
  int _likesCount = 0;
  bool _inWatchlist = false;
  bool _isFollowing = false;
  int _selectedStars = 5;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _likesCount = widget.film.likesCount;
    _checkStatus();
  }

  Future<void> _checkStatus() async {
    final user = _supabaseService.currentUser;
    if (user != null) {
      // Load current user interaction state if logged in
    }
  }

  Future<void> _handleLike() async {
    final user = _supabaseService.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please sign in to like films.')),
      );
      return;
    }

    try {
      final nowLiked = await _supabaseService.toggleLike(widget.film.id);
      setState(() {
        _isLiked = nowLiked;
        _likesCount += nowLiked ? 1 : -1;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  Future<void> _handleWatchlist() async {
    final user = _supabaseService.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please sign in to manage your watchlist.')),
      );
      return;
    }

    try {
      final nowWatch = await _supabaseService.toggleWatchlist(widget.film.id);
      setState(() {
        _inWatchlist = nowWatch;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(nowWatch ? 'Added to Watchlist!' : 'Removed from Watchlist.')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  Future<void> _handleReviewSubmit() async {
    final text = _reviewController.text.trim();
    if (text.isEmpty) return;

    final user = _supabaseService.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please sign in to post a review.')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      await _supabaseService.createReview(
        filmId: widget.film.id,
        content: text,
        stars: _selectedStars,
      );
      _reviewController.clear();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Your review has been published!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: Text(
          widget.film.title,
          style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAlignment.start,
          children: [
            
            // Poster / Media Banner Container
            Container(
              height: 220,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CachedNetworkImage(
                      imageUrl: widget.film.bannerUrl ?? widget.film.posterUrl,
                      fit: BoxFit.cover,
                    ),
                    Container(
                      color: Colors.black.withOpacity(0.3),
                      child: const Center(
                        child: CircleAvatar(
                          radius: 28,
                          backgroundColor: AppColors.accent,
                          child: Icon(Icons.play_arrow_rounded, color: Colors.white, size: 36),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Metadata Chips
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    widget.film.certificate,
                    style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${widget.film.languageName} • ${widget.film.releaseYear} • ${widget.film.ratingAverage} ★',
                  style: const TextStyle(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),

            const SizedBox(height: 8),

            Text(
              widget.film.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.black, color: Colors.white),
            ),

            const SizedBox(height: 14),

            // Interactive Action Buttons Row (Like, Watchlist, Share)
            Row(
              children: [
                OutlinedButton.icon(
                  onPressed: _handleLike,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: _isLiked ? AppColors.accent : Colors.white,
                    side: BorderSide(color: _isLiked ? AppColors.accent : AppColors.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: Icon(
                    _isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                    size: 18,
                    color: _isLiked ? AppColors.accent : Colors.white,
                  ),
                  label: Text('Like ($_likesCount)', style: const TextStyle(fontSize: 12)),
                ),
                const SizedBox(width: 10),
                OutlinedButton.icon(
                  onPressed: _handleWatchlist,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: _inWatchlist ? AppColors.gold : Colors.white,
                    side: BorderSide(color: _inWatchlist ? AppColors.gold : AppColors.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: Icon(
                    _inWatchlist ? Icons.check_rounded : Icons.add_rounded,
                    size: 18,
                    color: _inWatchlist ? AppColors.gold : Colors.white,
                  ),
                  label: Text(_inWatchlist ? 'In Watchlist' : 'Watchlist', style: const TextStyle(fontSize: 12)),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Synopsis
            const Text(
              'SYNOPSIS',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 1),
            ),
            const SizedBox(height: 6),
            Text(
              widget.film.description,
              style: const TextStyle(fontSize: 13, color: Colors.white70, height: 1.4),
            ),

            const SizedBox(height: 20),

            // Director & Follow Box
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.accent.withOpacity(0.2),
                    child: Text(widget.film.director.substring(0, 1), style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAlignment.start,
                      children: [
                        Text(widget.film.director, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        const Text('Independent Filmmaker', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                      ],
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      setState(() => _isFollowing = !_isFollowing);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(_isFollowing ? 'Following ${widget.film.director}' : 'Unfollowed')),
                      );
                    },
                    icon: Icon(_isFollowing ? Icons.person_check_rounded : Icons.person_add_rounded, size: 16),
                    label: Text(_isFollowing ? 'Following' : 'Follow', style: const TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Review & Rate Section
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAlignment.start,
                children: [
                  const Text(
                    'Write a Review & Rate',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 10),

                  // Star Selector Row
                  Row(
                    children: List.generate(5, (index) {
                      final starVal = index + 1;
                      return IconButton(
                        icon: Icon(
                          starVal <= _selectedStars ? Icons.star_rounded : Icons.star_outline_rounded,
                          color: AppColors.gold,
                          size: 26,
                        ),
                        onPressed: () => setState(() => _selectedStars = starVal),
                      );
                    }),
                  ),

                  const SizedBox(height: 10),

                  TextField(
                    controller: _reviewController,
                    maxLines: 3,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Share your thoughts about this film...',
                      hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                      filled: true,
                      fillColor: AppColors.surface,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.border),
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isSubmitting ? null : _handleReviewSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: _isSubmitting
                          ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Text('Submit Review', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ),

          ],
        ),
      ),
    );
  }
}
