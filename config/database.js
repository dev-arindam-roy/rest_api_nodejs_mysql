const mysql = require('mysql');


/** MYSQL DATABASE CONNECTION */
const dbConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

dbConn.connect(function(error){
    if (error) {
        console.error('database connection error: \n' + error.stack);
        return;
    } 
    console.log('mysql database connected successfully\ndatabase connected as id ' + dbConn.threadId);
});
/** END MYSQL DATABASE CONNECTION */




/** MYSQL POOL DATABASE CONNECTION */
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT
});

pool.getConnection(function(error, connection) {
    if (error) {
        console.error('database pool connection error: \n' + error);
        return;
    }
    console.log(`pool connected on ${connection.config.host}:${connection.config.port}, db:${connection.config.database}, user:${connection.config.user}`);
});
/** END MYSQL POOL DATABASE CONNECTION */



module.exports = pool;