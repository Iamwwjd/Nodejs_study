const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Router = require("./user/router");
const { Cookie } = require('express-session');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.json())


app.use(cors({
    origin : true,
    Credentials : true
}))

app.use(cookieParser());
app.use(
    session({
        key:"loginData",
        secret:"testSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);
app.use ("/router", Router)

app.listen (3000)