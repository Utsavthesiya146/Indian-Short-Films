CREATE TABLE IF NOT EXISTS `watchlists` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `film_id` VARCHAR(64) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_film_watch` (`user_id`, `film_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `film_likes` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `film_id` VARCHAR(64) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_film` (`user_id`, `film_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reviews` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `film_id` VARCHAR(64) NOT NULL,
    `content` TEXT NOT NULL,
    `stars` INT NOT NULL DEFAULT 5,
    `status` VARCHAR(20) DEFAULT 'published',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_film_review` (`user_id`, `film_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `film_submissions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `director` VARCHAR(255) NOT NULL,
    `language` VARCHAR(100) NOT NULL,
    `video_url` TEXT NOT NULL,
    `poster_url` VARCHAR(512) DEFAULT NULL,
    `synopsis` TEXT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `films` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(64) NOT NULL UNIQUE,
    `creator_id` INT UNSIGNED NOT NULL DEFAULT 1,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `synopsis` TEXT DEFAULT NULL,
    `video_url` VARCHAR(255) NOT NULL,
    `poster_url` VARCHAR(255) NOT NULL,
    `duration` VARCHAR(30) NOT NULL DEFAULT '15 mins',
    `genre` VARCHAR(60) NOT NULL,
    `language` VARCHAR(60) NOT NULL,
    `director` VARCHAR(120) NOT NULL,
    `views_count` BIGINT UNSIGNED DEFAULT 0,
    `likes_count` INT UNSIGNED DEFAULT 0,
    `rating` DECIMAL(3,2) DEFAULT 5.00,
    `is_featured` TINYINT(1) DEFAULT 0,
    `status` VARCHAR(50) DEFAULT 'approved',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(64) NOT NULL UNIQUE,
    `name` VARCHAR(120) NOT NULL,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE film_submissions ADD COLUMN IF NOT EXISTS poster_url VARCHAR(512) DEFAULT NULL;
ALTER TABLE film_submissions ADD COLUMN IF NOT EXISTS user_id VARCHAR(64) NOT NULL;
