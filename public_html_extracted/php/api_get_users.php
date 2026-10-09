<?php
/**
 * Indian Short Movie - Get All Registered Users API
 */
header('Content-Type: application/json');

@include_once __DIR__ . '/db.php';

$users = [];

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // Ensure users table exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `uuid` VARCHAR(64) NOT NULL UNIQUE,
            `name` VARCHAR(120) NOT NULL,
            `username` VARCHAR(60) NOT NULL UNIQUE,
            `email` VARCHAR(191) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `role` VARCHAR(20) DEFAULT 'user',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $stmt = $pdo->query("SELECT * FROM users ORDER BY id DESC");
        if ($stmt) {
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    } catch (Exception $e) {
        $users = [];
    }
}

echo json_encode([
    "success" => true,
    "count" => count($users),
    "users" => $users
]);
?>
