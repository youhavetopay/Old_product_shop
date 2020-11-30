var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//routes 추가하면 넣기
var indexRouter = require('./server/routes/index');
var usersRouter = require('./server/routes/users');
var orderRouter = require('./server/routes/order');
var companyRouter = require('./server/routes/company');

// 세션
const session = require('express-session');
const mysqlStore = require("express-mysql-session")(session)

const option = require('./server/dbconfig/sessionDB');

const sessionStore = new mysqlStore(option);

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
app.use('/order', orderRouter);
app.use('/company', companyRouter);

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
