<?php
$pUrl = "uploads/posters/poster_6ac736de5f1a8.png";
if (!empty($pUrl) && strpos($pUrl, 'http') !== 0) {
    $pUrl = 'https://indianshortmovies.com/' . ltrim($pUrl, '/');
}
echo "Result: " . $pUrl . "\n";
?>
