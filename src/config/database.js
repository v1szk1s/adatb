const mysql = require('mysql2');


const pool = mysql.createPool({
    user: 'user',
    host: '127.0.0.1',
    password: 'password',
    database: 'raktar'
});


module.exports = pool.promise();
