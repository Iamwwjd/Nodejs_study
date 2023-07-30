const db = require('./config')
const express = require("express");
const router = express.Router();

let db_config = require("./config");
let conn = db_config.init();
db_config.connect(conn);

const bcrypt = require('bcrypt')
const saltRounds = 10 /** 암호화를 몇번 진행할건지 */ 


router.post('/reqister', (req,res,next) => {
    const param = [req.body?.id, req.body?.pw, req.body?.name]

    bcrypt.hash(param[1], saltRounds, (error, hash)=>{
        param[1] = hash
        conn.query('insert into member values (?,?,?)', param, (err,row) =>{
            if(err){
                console.log(err)
            }
        });
    })
    res.end()
})

router.post('/login', (req, res, next) =>{
    const param = [req.body.id, req.body.pw];

    conn.query('select * from member where id=?', param[0],(err,row) =>{
        
        if(err){
            console.log(err);
        }

        if(row.length > 0){
            bcrypt.compare(param[1], row[0].pw, (error, result)=>{
                if(result){
                    console.log('로그인에 성공하였습니다.');

                    // 세션에 로그인 데이터 저장
                    req.session.loginData = {
                        id: row[0].id,
                        name: row[0].name
                    };

                    req.session.save(error => {
                        if (error) console.log(error);
                        res.json({ message: "success"});
                    });
                }
                else{
                    console.log('로그인에 실패하였습니다.');
                    res.json({message : 'fail'})
                }
            })
        
        }else{
            console.log('ID가 존재하지 않습니다.');
        }
    });
    res.end
})

router.get('/loginCheck', (req, res) =>{
    if(req.session.loginData){
        res.send({loggedIn : true, loginData: req.session.loginData})
    }
    else{
        res.send({loggedIn : false})
    }
})



module.exports = router;