<?php
require_once __DIR__ . '/cors.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["active" => false]);
    exit;
}

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$_SESSION['user_id']]);
        if (!$stmt->fetch()) {
            // User was deleted
            session_unset();
            session_destroy();
            setcookie(session_name(), '', time() - 3600, '/');
            echo json_encode(["active" => false]);
            exit;
        }
    } catch (Exception $e) {
        session_unset();
        session_destroy();
        setcookie(session_name(), '', time() - 3600, '/');
        echo json_encode(["active" => false]);
        exit;
    }
}

echo json_encode(["active" => true]);
?>
