<?php
/**
 * Indian Short Movie - Header Template
 * Production-ready PHP 8+ Header Include
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$debug_msg = "";
$debug_msg = "";
// Check if user still exists in the database
if (isset($_SESSION['user_id'])) {
    $db_path = realpath(__DIR__ . '/../php/db.php') ?: (__DIR__ . '/../php/db.php');
    @include_once $db_path;
    if (isset($pdo) && $pdo instanceof PDO) {
        try {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? OR uuid = ? LIMIT 1");
            $stmt->execute([$_SESSION['user_id'], $_SESSION['user_id']]);
            if (!$stmt->fetch()) {
                // User no longer exists, destroy session
                session_unset();
                session_destroy();
                setcookie(session_name(), '', time() - 3600, '/');
                // Force a reload to clear cached frontend state
                echo "<script>window.location.reload(true);</script>";
            }
        } catch (Exception $e) {
            // If ID is string and throws error, they are invalid, log them out
            session_unset();
            session_destroy();
            setcookie(session_name(), '', time() - 3600, '/');
            echo "<script>window.location.reload(true);</script>";
        }
    }
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
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $base_url; ?>indianshortmovies.png">
  <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $base_url; ?>indianshortmovies.png">
  <link rel="shortcut icon" type="image/png" href="<?php echo $base_url; ?>indianshortmovies.png">
  <link rel="apple-touch-icon" href="<?php echo $base_url; ?>indianshortmovies.png">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS via CDN for rapid styling -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            cinema: {
              bg: '#07080B',
              surface: '#111319',
              card: '#181B24',
              border: '#262A36',
              muted: '#8E95A5',
              accent: '#E50914',
              accentHover: '#FF1E27',
              gold: '#FFB703',
              teal: '#66FCF1',
            },
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Outfit', 'sans-serif'],
          },
        }
      }
    }
  </script>
  <style type="text/tailwindcss">
    @layer base {
      body {
        @apply bg-cinema-bg text-gray-100 flex flex-col min-h-screen antialiased selection:bg-cinema-accent selection:text-white;
      }
    }
  </style>
  
  <!-- Custom Styles -->
  <link rel="stylesheet" href="<?php echo $base_url; ?>css/style.css">
  
  <?php if (isset($extra_css)) { echo $extra_css; } ?>
</head>
<body class="bg-cinema-bg text-gray-100 flex flex-col min-h-screen antialiased selection:bg-cinema-accent selection:text-white dark">
