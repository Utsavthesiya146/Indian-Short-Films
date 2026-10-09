import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/api_service.dart';
import '../../submission/presentation/submit_film_screen.dart';
import '../../auth/presentation/login_screen.dart';
import '../../auth/presentation/auth_gate.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _user;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await _apiService.getCurrentUser();
    if (mounted) {
      setState(() {
        _user = user;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = _user;
    final email = user?['email'] ?? 'Audience Member';
    final name = user?['username'] ?? (email.contains('@') ? email.split('@')[0] : 'User');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          const SizedBox(height: 10),

          // Profile Avatar
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.accent, width: 2),
            ),
            child: CircleAvatar(
              radius: 42,
              backgroundColor: AppColors.accent.withValues(alpha: 0.2),
              child: Text(
                name.substring(0, 1).toUpperCase(),
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.accent),
              ),
            ),
          ),
          const SizedBox(height: 14),

          Text(
            name,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
          ),
          const SizedBox(height: 2),
          Text(
            user != null ? email : 'Sign in to sync watchlists & reviews',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),

          const SizedBox(height: 24),

          // Quick Stats Card
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStat('Watchlist', '12'),
                _buildStat('Reviewed', '5'),
                _buildStat('Followed', '3'),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Action Menu Items
          _buildMenuItem(
            icon: Icons.movie_creation_outlined,
            iconColor: AppColors.gold,
            title: 'Submit Your Short Film',
            subtitle: 'Filmmaker Portal',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SubmitFilmScreen()),
            ),
          ),

          const SizedBox(height: 10),

          _buildMenuItem(
            icon: Icons.language_rounded,
            iconColor: AppColors.teal,
            title: 'Language & Content Settings',
            subtitle: 'Hindi, Gujarati, Tamil & more',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Language settings updated.')),
              );
            },
          ),

          const SizedBox(height: 10),

          _buildMenuItem(
            icon: Icons.logout_rounded,
            iconColor: AppColors.accent,
            title: user != null ? 'Sign Out' : 'Sign In Account',
            subtitle: user != null ? 'Log out of this device' : 'Sign in to your account',
            onTap: () async {
              if (user != null) {
                await _apiService.signOut();
                ref.invalidate(authStateProvider);
              } else {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
                if (result == true) {
                  _loadUser();
                }
              }
            },
          ),

        ],
      ),
    );
  }

  Widget _buildStat(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: iconColor, size: 22),
        ),
        title: Text(title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textSecondary),
        onTap: onTap,
      ),
    );
  }
}
