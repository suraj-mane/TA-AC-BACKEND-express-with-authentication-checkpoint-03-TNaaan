var express = require('express');
var router = express.Router();
var User = require('../model/user');
var auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
var email = require("../credentials/email");
var Income = require("../model/income");
var Expense = require("../model/expense");
var moment = require('moment');

/* GET users listing. */
router.get('/', (req,res,next) => {
  res.send("User Data");
})

// GET login page 
router.get('/login', (req,res,next) => {
  res.render('loginPage');
})

// GET Register page 
router.get('/register', (req,res,next) => {
  var remail = email.verifyedemail;
  res.render('registerPage',{remail});
}) 

// POST Register 
router.post('/register', (req,res,next) => {
  var password = req.body.password;
  console.log(password);
  if(!password){
    res.redirect("/emailverify");
  } else {
    User.create(req.body, (err,user) => {
      if(err){
        res.redirect('/users/register');
      } else {
        res.redirect('/users/login');
      }
    })
  }
})

// POST login 
router.post('/login', (req,res,next) => {
  var {email,password} = req.body;
  if(!email || !password){
    res.redirect("/users/login");
  }
  User.findOne({email}, (err,user) => {
    if(err) return next(err)
    if(!user){
      res.redirect("/users/login");
    }
    user.verifyPassword(password, (err,result) => {
      if(err) return next(err);
      if(!result){
        res.redirect("/users/login");
      } else {
        req.session.userId = user.id;
        return res.redirect("/dashboard");
      }
    })
  })
})

// render forgot password 
router.get('/forgotpassword', (req,res,next) => {
  res.render('forgotpassword');
})

// check email
router.post('/forgotpassword', (req,res,next) => {
  var email = req.body.email;
  if(!email) {
    res.redirect("/users/forgotpassword");
  }
  User.findOne({email}, (err,user) => {
    if(err) return next(err);
    if(!user) {
      res.redirect("/users/forgotpassword");
    } else {
      res.render('changepassword',{user});
    }
  })
})

// new password 
router.post('/:id/newpassword', (req,res,next) => {
  var id = req.params.id;
  bcrypt.hash(req.body.password,10,(err,hash)=>{
    if(err) return next(err);
    req.body.password = hash;
    User.findByIdAndUpdate(id,req.body,(err,user) =>{
      if(err) return next(err);
      if(user){
        res.redirect("/users/login");
      } else {
        res.redirect("/users/forgotpassword")
      }
    })
  })
})
//logout 
router.get('/logout', (req,res,next) => {
  req.session.destroy;
  res.clearCookie("connect.sid");
  res.redirect('/');
})




module.exports = router;
