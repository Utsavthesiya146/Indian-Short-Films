<?php
/**
 * Indian Short Movie - Delete Film API
 */
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Film ID is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM films WHERE id = ?");
    $stmt->execute([$input['id']]);
    
    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete film: " . $e->getMessage()]);
}
?>
