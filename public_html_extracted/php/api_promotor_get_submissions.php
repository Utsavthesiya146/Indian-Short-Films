<?php
/**
 * Indian Short Movie - Promotor: Get My Submissions API
 */
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['promotor_logged_in']) || $_SESSION['promotor_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized.']);
    exit;
}

$promotor_id = (int)$_SESSION['promotor_id'];

try {
    // Ensure promotor_id column exists
    try { $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `promotor_id` INT UNSIGNED DEFAULT NULL"); } catch(Exception $ex){}
    try { $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `poster_url` VARCHAR(500) DEFAULT NULL"); } catch(Exception $ex){}

    $stmt = $pdo->prepare("SELECT * FROM film_submissions WHERE promotor_id = ? ORDER BY created_at DESC");
    $stmt->execute([$promotor_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'submissions' => $rows]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
