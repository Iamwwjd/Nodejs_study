const express = require('express')
const mysql = require('mysql') // 안될경우 npm install mysql
const path = require('path')
const static = require('server-static') // path와 static은 경로 때문에 사용
const dbconfig = require('./config/dbconfig.json') // dbconfig.json 파일을 사용

// Database connection pool
const pool = mysql.createPool({ // Pool은 모아놓고 사용하는 의미
    connectionLimit: 10, 
    host: dbconfig.host,
    user: dbconfig.name,
    password: dbconfig.password,
    database: dbconfig.database,
    debug:false

})

const app = express()
app.use(express.urlencoded({extended:true})) // extended (확장된 url 형태도 인정한다.)
app.use(express.json())
app.use('/public', static(path.json(_dirname, 'public'))); // static(루트 변경)

app.post('/process/adduser', (req, res)=> { //req (웹 브라우저로부터 들어온 정보) ,res (웹 브라우저한테 답변할 수 있는 정보)

})