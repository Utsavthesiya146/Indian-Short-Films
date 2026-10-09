-- =======================================================
-- INDIAN SHORT MOVIE - MySQL Database Schema
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- =======================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(120) NOT NULL,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT '/harri-kumar.jpg',
  `bio` TEXT DEFAULT NULL,
  `role` ENUM('user', 'creator', 'admin') DEFAULT 'user',
  `is_verified` TINYINT(1) DEFAULT 0,
  `followers_count` INT UNSIGNED DEFAULT 0,
  `following_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CREATORS TABLE
CREATE TABLE IF NOT EXISTS `creators` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `designation` VARCHAR(160) NOT NULL,
  `experience_years` INT UNSIGNED DEFAULT 0,
  `location` VARCHAR(120) DEFAULT 'Bangalore, India',
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `specialties` TEXT DEFAULT NULL, -- JSON or comma separated
  `total_views` BIGINT UNSIGNED DEFAULT 0,
  `total_likes` BIGINT UNSIGNED DEFAULT 0,
  `phone` VARCHAR(40) DEFAULT '+91 93418 73532',
  `website` VARCHAR(255) DEFAULT 'https://harrikumar.com',
  `instagram` VARCHAR(255) DEFAULT NULL,
  `youtube` VARCHAR(255) DEFAULT NULL,
  `linkedin` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SHORT FILMS TABLE
CREATE TABLE IF NOT EXISTS `films` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(64) NOT NULL UNIQUE,
  `creator_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `synopsis` TEXT DEFAULT NULL,
  `video_url` VARCHAR(255) NOT NULL,
  `poster_url` VARCHAR(255) NOT NULL,
  `trailer_url` VARCHAR(255) DEFAULT NULL,
  `duration` VARCHAR(30) NOT NULL DEFAULT '15 mins',
  `duration_seconds` INT UNSIGNED DEFAULT 900,
  `genre` VARCHAR(60) NOT NULL,
  `language` VARCHAR(60) NOT NULL,
  `category` VARCHAR(60) NOT NULL DEFAULT 'Short Film',
  `director` VARCHAR(120) NOT NULL,
  `cast` TEXT DEFAULT NULL,
  `release_year` INT UNSIGNED DEFAULT 2026,
  `views_count` BIGINT UNSIGNED DEFAULT 0,
  `likes_count` INT UNSIGNED DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `reviews_count` INT UNSIGNED DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_trending` TINYINT(1) DEFAULT 0,
  `is_new_release` TINYINT(1) DEFAULT 1,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
  `tags` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_genre` (`genre`),
  INDEX `idx_language` (`language`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. REELS (VERTICAL SHORT VIDEOS)
CREATE TABLE IF NOT EXISTS `reels` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(64) NOT NULL UNIQUE,
  `creator_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `video_url` VARCHAR(255) NOT NULL,
  `poster_url` VARCHAR(255) DEFAULT NULL,
  `music_title` VARCHAR(255) DEFAULT 'Original Audio',
  `duration` VARCHAR(30) DEFAULT '0:30',
  `likes_count` INT UNSIGNED DEFAULT 0,
  `comments_count` INT UNSIGNED DEFAULT 0,
  `shares_count` INT UNSIGNED DEFAULT 0,
  `saves_count` INT UNSIGNED DEFAULT 0,
  `views_count` BIGINT UNSIGNED DEFAULT 0,
  `language` VARCHAR(60) DEFAULT 'Hindi',
  `tags` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `target_id` VARCHAR(64) NOT NULL,
  `target_type` ENUM('film', 'reel') NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `comment_text` TEXT NOT NULL,
  `likes_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_target` (`target_type`, `target_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `film_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `headline` VARCHAR(255) NOT NULL,
  `comment` TEXT NOT NULL,
  `helpful_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_film_review` (`film_id`, `user_id`),
  FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. LIKES & SAVES TABLE
CREATE TABLE IF NOT EXISTS `film_likes` (
  `user_id` INT UNSIGNED NOT NULL,
  `film_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `film_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reel_likes` (
  `user_id` INT UNSIGNED NOT NULL,
  `reel_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `reel_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reel_id`) REFERENCES `reels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `saved_items` (
  `user_id` INT UNSIGNED NOT NULL,
  `target_id` VARCHAR(64) NOT NULL,
  `target_type` ENUM('film', 'reel') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `target_id`, `target_type`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(40) DEFAULT NULL,
  `inquiry_type` VARCHAR(80) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
