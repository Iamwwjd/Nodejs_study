var db = require('./db.js'); // db.js와 author.js가 같은 디렉토리에 있기 때문에 폴더 경로를 따로 표시해주지 않는다.
var template = require('./template.js');

exports.home = function(request, response){
    db.query(`select * from topic`, function(error, topics){
        db.query(`select * from author`, function(error2, authors){
        var title = 'author';
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `
        ${template.authorTable(authors)}
        <style>
            table{
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
        </style>
        <form action="create_author_process" method="post">
        <p>
            <input type="text" name="name" placeholder="name">

        </p>
        <p>
            <textarea name="profile" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
        `,
        `

        `
        );
        response.writeHead(200);
        response.end(html); // response.writeHead, response.end를 사용하여 클라이언트에 응답
      });
    });
}