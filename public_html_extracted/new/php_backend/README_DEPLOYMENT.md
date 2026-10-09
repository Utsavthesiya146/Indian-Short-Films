# INDIAN SHORT MOVIE - Production Deployment & Backend Setup

## Overview
Indian Short Movie is built with:
- **Frontend & App Interface**: Modern responsive UI with HTML5, CSS3, Tailwind CSS, TypeScript & React.
- **Backend Architecture**: RESTful PHP 8+ endpoints with PDO MySQL integration and secure file upload handling.
- **Database**: MySQL 5.7+ / 8.0+ / MariaDB 10.3+ with full relation schema and indices.

---

## 1. MySQL Database Installation
Import the provided schema into your MySQL server:
```bash
mysql -u your_user -p your_database < php_backend/schema.sql
```

## 2. Environment Variables (.env)
Configure your server environment or Apache/Nginx vhost:
```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=indian_short_movie
DB_USER=your_db_user
DB_PASS=your_db_password
```

## 3. Web Server Configuration
### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^api/auth$ php_backend/auth.php [L,QSA]
    RewriteRule ^api/films$ php_backend/films.php [L,QSA]
    RewriteRule ^api/upload$ php_backend/upload.php [L,QSA]
</IfModule>
```

### Nginx
```nginx
location /api/ {
    try_files $uri $uri/ /php_backend/$1.php?$args;
}

location /uploads/ {
    alias /var/www/indian_short_movie/public/uploads/;
    expires 30d;
}
```

## 4. Security Highlights
- Password hashing using `PASSWORD_BCRYPT` with cost factor 12.
- Strict MIME-type inspection via `finfo` for uploaded video and poster assets.
- XSS prevention and sanitized input wrappers.
- Anti-sniff headers (`nosniff`, `SAMEORIGIN`).
