<?php
/**
 * Indian Short Movie - Delete User API
 */
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        echo json_encode(["success" => true, "message" => "User deleted successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete user: " . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable"]);
}
?>
