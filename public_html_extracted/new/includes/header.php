<?php
/**
 * Indian Short Movie - Header Template
 * Production-ready PHP 8+ Header Include
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($base_url)) {
    $base_url = './';
}
if (!isset($page_title)) {
    $page_title = 'Indian Short Movie | Premier Indian Cinema & Short Films';
}
if (!isset($page_description)) {
    $page_description = 'The premier cinematic platform for Indian short films, vertical reels, independent filmmakers, and digital creators.';
}
if (!isset($current_page)) {
    $current_page = 'home';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title><?php echo htmlspecialchars($page_title); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
  <meta property="og:title" content="<?php echo htmlspecialchars($page_title); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($page_description); ?>">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="<?php echo $base_url; ?>css/style.css">
  
  <?php if (isset($extra_css)) { echo $extra_css; } ?>
</head>
<body class="bg-cinema-bg text-white">
