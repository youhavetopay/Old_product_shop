var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//routes 추가하면 넣기
var indexRouter = require('./server/routes/index');
var usersRouter = require('./server/routes/users');
const orderRouter = require('./server/routes/order');

// 세션
const session = require('express-session');
const mysqlStore = require("express-mysql-session")(session)

const options = {
  host: 'nodeprojectdb.cwjgblhoizab.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'zkwpdlxm12',
    database: 'dbpro'
}

const sessionStore = new mysqlStore(options);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션
app.use(session({
  secret: 'session!',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));

// 경로설정
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.user('/order', orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
