const pool = mysql.createPool({
    host: 'xxxxxxxx',
    user: 'xxxxxxxx',
    password: 'xxxxxxxx',
    database: 'xxxxxxxx',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
