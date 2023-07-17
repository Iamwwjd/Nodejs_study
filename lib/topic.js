var db = require('./db.js'); // db.js와 topic.js가 같은 디렉토리에 있기 때문에 폴더 경로를 따로 표시해주지 않는다.
var template = require('./template.js');
exports.home = function(request, response){ // topic.js는 api를 여러개 제공하기에 exports를 사용한다.
    db.query(`select * from topic`, function(error, topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html); // response.writeHead, response.end를 사용하여 클라이언트에 응답
      });
} 

