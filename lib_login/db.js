var mysql = require('mysql');
var db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "wqeruiy0605!",
    database: "Jeongyun"
});
db.connect();

module.exports = db;