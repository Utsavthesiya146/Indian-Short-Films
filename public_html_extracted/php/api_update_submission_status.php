<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
$status = $input['status'] ?? null;

if (!$id || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Submission ID and status are required"]);
    exit;
}

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // Fetch submission details first
        $fetch_stmt = $pdo->prepare("SELECT * FROM film_submissions WHERE id = ?");
        $fetch_stmt->execute([$id]);
        $sub = $fetch_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$sub) {
            http_response_code(404);
            echo json_encode(["error" => "Submission not found"]);
            exit;
        }

        // Update submission status
        $stmt = $pdo->prepare("UPDATE film_submissions SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        // Ensure the films table exists before syncing
        $pdo->exec("CREATE TABLE IF NOT EXISTS `films` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        // Sync with live Film table for the website
        if ($status === 'published' || $status === 'approved') {
            $check = $pdo->prepare("SELECT id FROM films WHERE video_url = ?");
            $check->execute([$sub['video_url']]);
            if (!$check->fetch()) {
                $film_uuid = 'film-' . uniqid() . rand(1000, 9999);
                $synopsis = $sub['synopsis'] ?? 'A new short film';

                // Use submission's poster_url if set, else default
                $poster = !empty($sub['poster_url'])
                    ? $sub['poster_url']
                    : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';

                $insert = $pdo->prepare("INSERT INTO films (uuid, creator_id, title, description, synopsis, video_url, poster_url, duration, genre, language, director, status) VALUES (?, 1, ?, ?, ?, ?, ?, '15 mins', ?, ?, ?, 'approved')");
                $film_genre = !empty($sub['genre']) ? $sub['genre'] : 'Drama';
                $insert->execute([$film_uuid, $sub['title'], $synopsis, $synopsis, $sub['video_url'], $poster, $film_genre, $sub['language'], $sub['director']]);
            }
        } elseif ($status === 'verified' || $status === 'pending' || $status === 'rejected') {
            // Unpublish by deleting from the Film table
            $del = $pdo->prepare("DELETE FROM films WHERE video_url = ?");
            $del->execute([$sub['video_url']]);
        }
        
        echo json_encode(["success" => true, "message" => "Status updated successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update submission: " . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable"]);
}
?>
