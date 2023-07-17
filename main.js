var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var db = require('./lib/db.js');
var topic = require('./lib/topic')

var app = http.createServer(function(request,response){ // 서버 생성
    var _url = request.url; 
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){ // 메인페이지
      if(queryData.id === undefined){
        topic.home(request, response);
      }else {
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
    } else if(pathname === '/create'){
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
    } else if(pathname === '/create_process'){
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
    } else if(pathname === '/update'){
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
    } else if(pathname === '/update_process'){
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
    } else if(pathname === '/delete_process'){
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
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
