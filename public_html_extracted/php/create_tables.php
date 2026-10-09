<?php
require_once __DIR__ . '/db.php';

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS `watchlists` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT UNSIGNED NOT NULL,
        `film_id` VARCHAR(100) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_user_id` (`user_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    echo "<h1 style='color:green;'>SUCCESS: The 'watchlists' table has been created!</h1>";
    echo "<p>You can now go back to the app and add films to your Watchlist.</p>";
    
} catch(PDOException $e) {
    echo "<h1 style='color:red;'>ERROR: Failed to create table</h1>";
    echo "<p><strong>Reason:</strong> " . $e->getMessage() . "</p>";
    echo "<p>Please check your Hostinger MySQL database user permissions (ensure the user has 'CREATE' permissions).</p>";
}
?>
