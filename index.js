const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Router = require("./router");
app.use(express.json())
app.use ("/router", Router)

app.listen (3000)