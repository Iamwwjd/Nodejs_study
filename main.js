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
        topic.page(request, response);
      }
    } else if(pathname === '/create'){
        topic.create(request, response);
    } else if(pathname === '/create_process'){
        topic.create_process(request, response);
    } else if(pathname === '/update'){
        topic.update(request, response);
    } else if(pathname === '/update_process'){
        topic.update_process(request, response);
    } else if(pathname === '/delete_process'){
        topic.delete_process(request. response);
    } else if(pathname === '/author'){
      author.home(request. response);
    } else if(pathname === '/create_author_process'){
      author.create_author_process(request, response);
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
