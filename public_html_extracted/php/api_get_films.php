<?php
/**
 * Indian Short Movie - Get Films API
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

try {
    // Auto-sync all film submissions into live films table if missing
    try {
        $pub_stmt = $pdo->query("SELECT * FROM film_submissions");
        if ($pub_stmt) {
            $pub_subs = $pub_stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($pub_subs as $ps) {
                $pTitle = !empty($ps['title']) ? trim($ps['title']) : '';
                if (!empty($pTitle)) {
                    $vUrl = !empty($ps['video_url']) ? trim($ps['video_url']) : (!empty($ps['video']) ? trim($ps['video']) : '');
                    if (!empty($vUrl)) {
                        $check = $pdo->prepare("SELECT id FROM films WHERE title = ?");
                        $check->execute([$pTitle]);
                        if (!$check->fetch()) {
                            $film_uuid = 'film-' . uniqid() . rand(1000, 9999);
                            $syn = !empty($ps['synopsis']) ? trim($ps['synopsis']) : (!empty($ps['description']) ? trim($ps['description']) : 'Independent short film');
                            $poster = !empty($ps['poster_url']) ? trim($ps['poster_url']) : (!empty($ps['thumbnail']) ? trim($ps['thumbnail']) : '');
                            $lang = !empty($ps['language']) ? trim($ps['language']) : 'Unknown';
                            $dir = !empty($ps['director']) ? trim($ps['director']) : 'Unknown Director';
                            $ins = $pdo->prepare("INSERT INTO films (uuid, creator_id, title, description, synopsis, video_url, poster_url, duration, genre, language, director, status) VALUES (?, 1, ?, ?, ?, ?, ?, '15 mins', 'Drama', ?, ?, 'approved')");
                            $ins->execute([$film_uuid, $pTitle, $syn, $syn, $vUrl, $poster, $lang, $dir]);
                        }
                    }
                }
            }
        }
    } catch (Exception $ex) {}

    $stmt = $pdo->query("SELECT * FROM films ORDER BY created_at DESC");
    $films = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

    // Direct fallback merge from film_submissions to ensure 100% visibility of all published videos
    try {
        $sub_stmt = $pdo->query("SELECT * FROM film_submissions ORDER BY id DESC");
        if ($sub_stmt) {
            $submissions = $sub_stmt->fetchAll(PDO::FETCH_ASSOC);
            $existingTitles = array_map(function($f) { return strtolower(trim($f['title'] ?? '')); }, $films);
            
            foreach ($submissions as $sub) {
                $subTitle = trim($sub['title'] ?? '');
                if (!empty($subTitle) && !in_array(strtolower($subTitle), $existingTitles)) {
                    $films[] = [
                        'id' => 'sub-' . ($sub['id'] ?? rand(100,999)),
                        'uuid' => 'sub-' . ($sub['id'] ?? rand(100,999)),
                        'title' => $subTitle,
                        'description' => $sub['synopsis'] ?? $sub['description'] ?? 'Independent short film',
                        'synopsis' => $sub['synopsis'] ?? $sub['description'] ?? 'Independent short film',
                        'video_url' => !empty($sub['video_url']) ? $sub['video_url'] : (!empty($sub['video']) ? $sub['video'] : ''),
                        'poster_url' => !empty($sub['poster_url']) ? $sub['poster_url'] : (!empty($sub['thumbnail']) ? $sub['thumbnail'] : ''),
                        'duration' => !empty($sub['duration']) ? $sub['duration'] : '15 mins',
                        'genre' => !empty($sub['genre']) ? $sub['genre'] : 'Drama',
                        'language' => !empty($sub['language']) ? $sub['language'] : 'Unknown',
                        'director' => !empty($sub['director']) ? $sub['director'] : 'Unknown Director',
                        'views_count' => 0,
                        'likes_count' => 0,
                        'rating' => 0,
                        'is_featured' => 0,
                        'status' => 'approved'
                    ];
                }
            }
        }
    } catch (Exception $ex) {}
    
    // Convert likesCount and viewsCount to numbers for frontend, format exactly like DEFAULT_FILMS
    $result = array_map(function($f) {
        $vUrl = trim($f['video_url'] ?? '');
        if (!empty($vUrl) && strpos($vUrl, 'http') !== 0) {
            $vUrl = 'https://indianshortmovies.com/' . ltrim($vUrl, '/');
        }
        
        $pUrl = trim($f['poster_url'] ?? '');
        if (!empty($pUrl) && strpos($pUrl, 'http') !== 0) {
            $pUrl = 'https://indianshortmovies.com/' . ltrim($pUrl, '/');
        }

        return [
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
    }, $films);
    
    // Filter out items that have no video URL at all
    $result = array_values(array_filter($result, function($r) {
        return !empty($r['videoUrl']);
    }));
    
    echo json_encode($result);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch films: " . $e->getMessage()]);
}
?>
