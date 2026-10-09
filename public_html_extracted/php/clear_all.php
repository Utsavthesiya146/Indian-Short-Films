<?php
require_once __DIR__ . '/db.php';
$pdo->exec("TRUNCATE TABLE films");
$pdo->exec("TRUNCATE TABLE film_submissions");
echo "Database cleared successfully.";
?>
