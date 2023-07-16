var mysql = require('mysql');
var db = mysql.createConnection({ //db.connection()을 호출하여 연결한다.
    host : '127.0.0.1',
    user : '!',
    port : '3306',
    password : '!',
    database : '!'
});
module.exports = db; // 밖에서 쓸 수 있도록 하는 작업
// 여러개의 모듈을 사용할때는 exports만 사용