<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$film_id = $input['film_id'] ?? '';

if (empty($film_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Film ID is required"]);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $user_id = $_SESSION['user_id'];
    
    // Check if like exists
    $stmt = $pdo->prepare("SELECT id FROM film_likes WHERE user_id = ? AND film_id = ?");
    $stmt->execute([$user_id, $film_id]);
    $existing = $stmt->fetch();

    $liked = false;
    
    if ($existing) {
        // Remove like
        $pdo->prepare("DELETE FROM film_likes WHERE id = ?")->execute([$existing['id']]);
        
        // Update films table if numeric ID or handle uuid
        $upd = $pdo->prepare("UPDATE films SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ? OR uuid = ?");
        $upd->execute([$film_id, $film_id]);
    } else {
        // Add like
        $pdo->prepare("INSERT INTO film_likes (user_id, film_id) VALUES (?, ?)")->execute([$user_id, $film_id]);
        
        $upd = $pdo->prepare("UPDATE films SET likes_count = likes_count + 1 WHERE id = ? OR uuid = ?");
        $upd->execute([$film_id, $film_id]);
        $liked = true;
    }

    echo json_encode(["success" => true, "liked" => $liked]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
