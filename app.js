const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRoutes = require('./Routes/authRoutes');
const session = require('express-session');

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use('/', userRoutes);




module.exports = app;