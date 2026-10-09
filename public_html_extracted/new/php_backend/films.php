<?php
/**
 * INDIAN SHORT MOVIE - Films & Reels API
 */

require_once __DIR__ . '/config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

if ($method === 'GET' && $action === 'list') {
    $genre    = $_GET['genre'] ?? '';
    $language = $_GET['language'] ?? '';
    $category = $_GET['category'] ?? '';
    $search   = $_GET['search'] ?? '';
    $sort     = $_GET['sort'] ?? 'trending';

    $sql = 'SELECT f.*, u.name as creator_name, u.avatar as creator_avatar 
            FROM films f 
            JOIN users u ON f.creator_id = u.id 
            WHERE f.status = "approved"';
    $params = [];

    if (!empty($genre) && $genre !== 'All') {
        $sql .= ' AND f.genre = ?';
        $params[] = $genre;
    }
    if (!empty($language) && $language !== 'All') {
        $sql .= ' AND f.language = ?';
        $params[] = $language;
    }
    if (!empty($category) && $category !== 'All') {
        $sql .= ' AND f.category = ?';
        $params[] = $category;
    }
    if (!empty($search)) {
        $sql .= ' AND (f.title LIKE ? OR f.description LIKE ? OR f.director LIKE ? OR f.cast LIKE ?)';
        $searchParam = "%{$search}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }

    if ($sort === 'views') {
        $sql .= ' ORDER BY f.views_count DESC';
    } elseif ($sort === 'rating') {
        $sql .= ' ORDER BY f.rating DESC';
    } elseif ($sort === 'newest') {
        $sql .= ' ORDER BY f.created_at DESC';
    } else {
        $sql .= ' ORDER BY f.is_trending DESC, f.views_count DESC';
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $films = $stmt->fetchAll();

    jsonResponse(true, 'Films fetched', $films);
}

if ($method === 'POST' && $action === 'create') {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(false, 'Unauthorized. Please login to publish.', null, 401);
    }

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?? [];

    $title       = sanitizeInput($data['title'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $synopsis    = sanitizeInput($data['synopsis'] ?? $description);
    $videoUrl    = filter_var(trim($data['videoUrl'] ?? ''), FILTER_SANITIZE_URL);
    $posterUrl   = filter_var(trim($data['posterUrl'] ?? ''), FILTER_SANITIZE_URL);
    $genre       = sanitizeInput($data['genre'] ?? 'Drama');
    $language    = sanitizeInput($data['language'] ?? 'Hindi');
    $category    = sanitizeInput($data['category'] ?? 'Short Film');
    $director    = sanitizeInput($data['director'] ?? $_SESSION['username']);
    $duration    = sanitizeInput($data['duration'] ?? '15 mins');

    if (empty($title) || empty($videoUrl)) {
        jsonResponse(false, 'Title and Video URL are required.', null, 400);
    }

    $uuid = bin2hex(random_bytes(16));

    $sql = 'INSERT INTO films (uuid, creator_id, title, description, synopsis, video_url, poster_url, genre, language, category, director, duration) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $uuid,
        $_SESSION['user_id'],
        $title,
        $description,
        $synopsis,
        $videoUrl,
        $posterUrl,
        $genre,
        $language,
        $category,
        $director,
        $duration
    ]);

    jsonResponse(true, 'Film published successfully', ['id' => $pdo->lastInsertId(), 'uuid' => $uuid], 201);
}

jsonResponse(false, 'Invalid request', null, 400);
