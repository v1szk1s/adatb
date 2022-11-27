User felhasználó készítése a raktar adatbázishoz:
    CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost';

Adatbázis lementése:
    mysqldump --databases --user=user -p raktar > raktar.sql

Adatbázi betöltése:
    sudo mysql < raktar.sql

