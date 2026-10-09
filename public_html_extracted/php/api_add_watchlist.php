<?php
require_once __DIR__ . '/cors.php';
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
    
    // Check if in watchlist
    $stmt = $pdo->prepare("SELECT id FROM watchlists WHERE user_id = ? AND film_id = ?");
    $stmt->execute([$user_id, $film_id]);
    $existing = $stmt->fetch();

    $added = false;
    
    if ($existing) {
        // Remove from watchlist
        $pdo->prepare("DELETE FROM watchlists WHERE id = ?")->execute([$existing['id']]);
    } else {
        // Add to watchlist
        $pdo->prepare("INSERT INTO watchlists (user_id, film_id) VALUES (?, ?)")->execute([$user_id, $film_id]);
        $added = true;
    }

    echo json_encode(["success" => true, "inWatchlist" => $added]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
