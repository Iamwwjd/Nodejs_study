const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Router = require("./router");
app.use ("/router", Router)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.listen (3000)