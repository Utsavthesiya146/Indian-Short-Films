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
$content = trim($input['content'] ?? '');
$stars = (int)($input['stars'] ?? 5);

if (empty($film_id) || empty($content)) {
    http_response_code(400);
    echo json_encode(["error" => "Film ID and review content are required"]);
    exit;
}

if ($stars < 1 || $stars > 5) {
    $stars = 5;
}

require_once __DIR__ . '/db.php';

try {
    $user_id = $_SESSION['user_id'];
    
    // Upsert review
    $stmt = $pdo->prepare("SELECT id FROM reviews WHERE user_id = ? AND film_id = ?");
    $stmt->execute([$user_id, $film_id]);
    $existing = $stmt->fetch();

    if ($existing) {
        $upd = $pdo->prepare("UPDATE reviews SET content = ?, stars = ? WHERE id = ?");
        $upd->execute([$content, $stars, $existing['id']]);
    } else {
        $ins = $pdo->prepare("INSERT INTO reviews (user_id, film_id, content, stars) VALUES (?, ?, ?, ?)");
        $ins->execute([$user_id, $film_id, $content, $stars]);
    }

    // Optional: Recalculate average rating for the film
    $avg_stmt = $pdo->prepare("SELECT AVG(stars) as avg_rating FROM reviews WHERE film_id = ?");
    $avg_stmt->execute([$film_id]);
    $avg_data = $avg_stmt->fetch();
    
    if ($avg_data && isset($avg_data['avg_rating'])) {
        $new_avg = round($avg_data['avg_rating'], 2);
        $pdo->prepare("UPDATE films SET rating = ? WHERE id = ? OR uuid = ?")->execute([$new_avg, $film_id, $film_id]);
    }

    echo json_encode(["success" => true, "message" => "Review submitted"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
