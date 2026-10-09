<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Submission ID is required"]);
    exit;
}

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // First, fetch the submission details so we can also remove from films table
        $fetch = $pdo->prepare("SELECT * FROM film_submissions WHERE id = ?");
        $fetch->execute([$id]);
        $sub = $fetch->fetch(PDO::FETCH_ASSOC);

        // Delete from film_submissions
        $stmt = $pdo->prepare("DELETE FROM film_submissions WHERE id = ?");
        $stmt->execute([$id]);

        // Also delete the matching film from the films table (linked by video_url)
        if ($sub && !empty($sub['video_url'])) {
            $del_film = $pdo->prepare("DELETE FROM films WHERE video_url = ?");
            $del_film->execute([$sub['video_url']]);
        }
        
        echo json_encode(["success" => true, "message" => "Submission and published film deleted successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete submission: " . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable"]);
}
?>
