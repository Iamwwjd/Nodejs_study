const { request, response } = require('express');
var db = require('./db.js'); // db.js와 topic.js가 같은 디렉토리에 있기 때문에 폴더 경로를 따로 표시해주지 않는다.
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

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

exports.page = function(request, response){
    var _url = request.url; 
    var queryData = url.parse(_url, true).query;
    db.query(`select * from topic`, function(error, topics){
        if(error){
          throw error;
        }
        db.query(`select * from topic left join author on topic.author_id=author.id  where topic.id=?`,[queryData.id],function(error2, topic){ // id에 queryData.id를 두번째 인자로 따로 받는 것이 훨씬 보안성이 높다.
          if(error2){
            throw error2;
          }
          console.log(topic[0].title);
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `<h2>${title}</h2>
        ${description}
        <p> ${topic[0].name} </p>`,
        ` <a href="/create">create</a>
        <a href="/update?id=${queryData.id}">update</a>
        <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}">
          <input type="submit" value="delete">
        </form>`

        );
        response.writeHead(200);
        response.end(html);
        })
      });   
}

exports.create = function(request, response){
    db.query(`select * from topic`, function(error, topics){
        db.query('select * from author', function(error2, authors){
        var title = 'create';
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          ${template.authorSelect(authors)}
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
        `,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html)
        });
      });
}

exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body); // post 타입 데이터 파싱
          db.query(`
          insert into topic (title, description, created, author_id) 
          values(?, ?, now(), ?)`, // 데이터 저장 sql문
          [post.title, post.description, post.author],
          function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          }
        )
      });
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('select * from topic', function(error, topics){
        if(error){
          throw error;
        }
        db.query(`select * from topic`, function(error, topics){
          if(error2){
            throw error2;
          }
          db.query('select * from author', function(error2, authors){
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });

        });
    });
        
}

exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });

          db.query('update topic set title=?, description=?, author_id=1 where id=?', [post.title, post.description, post.author, post.id], function(error, result){
            response.writeHead(302, {Location: `/?id=${post.id}`});
              response.end();
          })
      });
}

exports.delete_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query('delete from topic where id = ?', [post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
}