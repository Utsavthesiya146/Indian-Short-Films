<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$bio = trim($input['bio'] ?? '');
$crew = trim($input['crew'] ?? '');
$user_id = $_SESSION['user_id'];

if (empty($name)) {
    http_response_code(400);
    echo json_encode(["error" => "Name cannot be empty."]);
    exit;
}

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, bio = ?, crew_info = ? WHERE id = ?");
        $stmt->execute([$name, $bio, $crew, $user_id]);
        
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable"]);
}
?>
