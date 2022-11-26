mysqldump --databases --user=user --password raktar > database.sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' WITH GRANT OPTION;
create database raktar character set 'utf8mb4';
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

mysqldump --databases --user=user --password raktar > database.sql
