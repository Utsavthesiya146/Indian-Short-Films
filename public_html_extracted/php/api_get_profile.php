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
    
    // Get user details
    $stmt = $pdo->prepare("SELECT id, name, username, email, role, created_at FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        exit;
    }
    
    // Get watchlist count
    $w_stmt = $pdo->prepare("SELECT COUNT(*) as c FROM watchlists WHERE user_id = ?");
    $w_stmt->execute([$user_id]);
    $watchlistCount = $w_stmt->fetchColumn();
    
    // Get submissions count
    $s_stmt = $pdo->prepare("SELECT COUNT(*) as c FROM film_submissions WHERE user_id = ?");
    $s_stmt->execute([$user_id]);
    $submissionsCount = $s_stmt->fetchColumn();
    
    $user['watchlist_count'] = (int)$watchlistCount;
    $user['films_submitted'] = (int)$submissionsCount;
    
    echo json_encode(["success" => true, "profile" => $user]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
