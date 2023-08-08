const express = require("express");
const router = express.Router();
const mysql = require('mysql');
require("dotenv").config();

var db_info = {
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "Jeongyun",
};

const db_config = {
  init: function () {
    return mysql.createConnection(db_info);
  },
  connect: function (conn) {
    conn.connect(function (err) {
      if (err) {
        console.error("mysql connection error : " + err);}
      else {
        console.log("mysql is connected successfully!");}
    })
    createConnection.end();
  },
};

module.exports= {
  db_config: this.db_config,
  router: router,
};