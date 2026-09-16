import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          const SizedBox(height: 20),
          const CircleAvatar(
            radius: 45,
            backgroundColor: AppColors.accent,
            child: Icon(Icons.person_rounded, size: 50, color: Colors.white),
          ),
          const SizedBox(height: 14),
          const Text(
            'Audience Member',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const Text(
            'user@indianshortfilms.com',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 24),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(16),
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

          ListTile(
            leading: const Icon(Icons.movie_creation_outlined, color: AppColors.gold),
            title: const Text('Submit Your Short Film', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textSecondary),
            onTap: () {},
          ),
          const Divider(color: AppColors.border),
          ListTile(
            leading: const Icon(Icons.settings_outlined, color: AppColors.teal),
            title: const Text('Settings & App Language', style: TextStyle(color: Colors.white, fontSize: 13)),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textSecondary),
            onTap: () {},
          ),
          const Divider(color: AppColors.border),
          ListTile(
            leading: const Icon(Icons.logout_rounded, color: AppColors.accent),
            title: const Text('Sign Out', style: TextStyle(color: AppColors.accent, fontSize: 13, fontWeight: FontWeight.bold)),
            onTap: () {},
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
}
