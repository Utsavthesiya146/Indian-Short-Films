<?php
header('Content-Type: application/json');

@include_once __DIR__ . '/db.php';

$submissions = [];

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `film_submissions` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `director` VARCHAR(255) NOT NULL,
            `language` VARCHAR(100) NOT NULL,
            `genre` VARCHAR(60) NOT NULL DEFAULT 'Drama',
            `video_url` TEXT NOT NULL,
            `synopsis` TEXT NOT NULL,
            `status` VARCHAR(50) DEFAULT 'pending',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Ensure genre column exists on already-created tables
        try {
            $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `genre` VARCHAR(60) NOT NULL DEFAULT 'Drama'");
        } catch (\PDOException $ex) {}

        $stmt = $pdo->query("SELECT * FROM film_submissions ORDER BY id DESC");
        if ($stmt) {
            $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    } catch (Exception $e) {
        $submissions = [];
    }
}

echo json_encode([
    "success" => true,
    "submissions" => $submissions
]);
?>
