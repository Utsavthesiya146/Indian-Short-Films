<?php
require_once __DIR__ . '/cors.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $user_id = $_SESSION['user_id'];
    
    // Get all film IDs in user's watchlist
    $stmt = $pdo->prepare("SELECT film_id, created_at FROM watchlists WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $watchlist_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $result = [];
    foreach ($watchlist_items as $item) {
        $film_id = $item['film_id'];
        $f = null;
        
        // Check if it's a submission
        if (strpos($film_id, 'sub-') === 0) {
            $sub_id = str_replace('sub-', '', $film_id);
            $sub_stmt = $pdo->prepare("SELECT * FROM film_submissions WHERE id = ?");
            $sub_stmt->execute([$sub_id]);
            $sub = $sub_stmt->fetch(PDO::FETCH_ASSOC);
            if ($sub) {
                $f = [
                    'id' => 'sub-' . $sub['id'],
                    'uuid' => 'sub-' . $sub['id'],
                    'title' => $sub['title'] ?? 'Untitled Film',
                    'director' => !empty($sub['director']) ? $sub['director'] : 'Unknown Director',
                    'language' => !empty($sub['language']) ? $sub['language'] : 'Unknown',
                    'genre' => !empty($sub['genre']) ? $sub['genre'] : 'Drama',
                    'duration' => !empty($sub['duration']) ? $sub['duration'] : '15 mins',
                    'likes_count' => 0,
                    'views_count' => 0,
                    'rating' => 0,
                    'poster_url' => !empty($sub['poster_url']) ? $sub['poster_url'] : (!empty($sub['thumbnail']) ? $sub['thumbnail'] : ''),
                    'video_url' => !empty($sub['video_url']) ? $sub['video_url'] : (!empty($sub['video']) ? $sub['video'] : ''),
                    'synopsis' => $sub['synopsis'] ?? $sub['description'] ?? '',
                    'is_featured' => 0,
                    'status' => 'approved'
                ];
            }
        } else {
            // Check in films table
            $f_stmt = $pdo->prepare("SELECT * FROM films WHERE id = ? OR uuid = ?");
            $f_stmt->execute([$film_id, $film_id]);
            $f = $f_stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        if ($f) {
            $vUrl = trim($f['video_url'] ?? '');
            if (!empty($vUrl) && strpos($vUrl, 'http') !== 0) {
                $vUrl = 'https://indianshortmovies.com/' . ltrim($vUrl, '/');
            }
            
            $pUrl = trim($f['poster_url'] ?? '');
            if (!empty($pUrl) && strpos($pUrl, 'http') !== 0) {
                $pUrl = 'https://indianshortmovies.com/' . ltrim($pUrl, '/');
            }

            if (!empty($vUrl)) {
                $result[] = [
                    'id' => $f['id'] ?? ($f['uuid'] ?? rand(1000,9999)),
                    'title' => $f['title'] ?? 'Untitled Film',
                    'director' => !empty($f['director']) ? $f['director'] : 'Unknown Director',
                    'language' => !empty($f['language']) ? $f['language'] : 'Unknown',
                    'genre' => !empty($f['genre']) ? $f['genre'] : 'Drama',
                    'duration' => !empty($f['duration']) ? $f['duration'] : '15 mins',
                    'likesCount' => (int)($f['likes_count'] ?? 0),
                    'viewsCount' => (int)($f['views_count'] ?? 0),
                    'rating' => (float)($f['rating'] ?? 0),
                    'posterUrl' => $pUrl,
                    'backdropUrl' => $pUrl,
                    'videoUrl' => $vUrl,
                    'synopsis' => $f['synopsis'] ?? $f['description'] ?? '',
                    'isFeatured' => (bool)($f['is_featured'] ?? false),
                    'status' => $f['status'] ?? 'approved'
                ];
            }
        }
    }

    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
