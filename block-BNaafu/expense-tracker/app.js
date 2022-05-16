var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();
var session = require('express-session');
var MongoStore = require('connect-mongo');
var passport = require('passport');
var auth = require('./middleware/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var EmailVerify = require('./routes/EmailVerify');
var incomeRouter = require('./routes/income');
var expenseRouter = require("./routes/expense");


require('./modelus/passport');

mongoose.connect('mongodb://localhost/expense', (err) => {
  console.log(err ? err:"connect");
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
secret: process.env.SECRET,
resave: false,
saveUninitialized: true,
store: MongoStore.create({ mongoUrl:'mongodb://localhost/expense'})
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(auth.isUserInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/emailverify', EmailVerify);
app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);

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
