var mysql = require('mysql');
var db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "??",
    database: "??"
});
db.connect();

module.exports = db;