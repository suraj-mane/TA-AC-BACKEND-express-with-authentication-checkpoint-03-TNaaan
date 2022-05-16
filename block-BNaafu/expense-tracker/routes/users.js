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
let date = new Date().getMonth();
let month = moment(new Date()).format("M")

router.get('/', auth.isUserLogged, async (req, res, next) => {
  if(req.query.month){
    let currDate = new Date();
    let m = String(req.query.month).split('-')[1];
    let currntYear = moment(currDate).format('YYYY');
    let date = new Date(currntYear + '-' + m + '-' + '01');
    let firstDate = new Date(date.getFullYear(), date.getMonth(), 02);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var income = await Income.find({userId: req.user.id, incomeDate:{$gte: new Date(firstDate), $lt: new Date(endDate)}});
    var expense = await Expense.find({userId:req.user.id, expenseDate:{$gte: new Date(firstDate), $lt: new Date(endDate)}});
    var totalIncome = 0;
    var totalExpense = 0;
    income.forEach(ele => {
      totalIncome += Number(ele.amount);
    });
    expense.forEach(ele => {
      totalExpense += Number(ele.amount);
    });
    console.log(totalExpense,totalIncome);
    var balance = totalIncome - totalExpense;
    res.render("dashborad",{totalIncome,totalExpense,balance,month});
  }
  if(req.query.start && req.query.end){
    var startDate = req.query.start;
    var endDate = req.query.end;
    var income = await Income.find({userId: req.user.id, incomeDate:{$gte: startDate, $lt: endDate}});
    var expense = await Expense.find({userId:req.user.id, expenseDate:{$gte:startDate, $lt:endDate}});
    var totalIncome = 0;
    var totalExpense = 0;
    income.forEach(ele => {
      totalIncome += Number(ele.amount);
    });
    expense.forEach(ele => {
      totalExpense += Number(ele.amount);
    });
    var balance = totalIncome - totalExpense;
    res.render("dashborad",{totalIncome,totalExpense,balance,month});
  }
  if(req.query.incomecategory && req.query.expensecategory){
    var incomecategory = req.query.incomecategory;
    var expensecategory = req.query.expensecategory;
    var income = await Income.find({userId: req.user.id, incomeSource:incomecategory});
    var expense = await Expense.find({userId:req.user.id, expenseSource:expensecategory});
    var totalIncome = 0;
    var totalExpense = 0;
    income.forEach(ele => {
      totalIncome += Number(ele.amount);
    });
    expense.forEach(ele => {
      totalExpense += Number(ele.amount);
    });
    var balance = totalIncome - totalExpense;
    res.render("dashborad",{totalIncome,totalExpense,balance,month});
  }
  if(req.query.category && req.query.start){
    var category = req.query.category;
    var start = req.query.start;
    var income = await Income.find({userId:req.user.id,incomeSource:category,incomeDate:new Date(start)});
    var expense = await Expense.find({userId:req.user.id, expenseSource:category, expenseDate:new Date(start)})
    var totalIncome = 0;
    var totalExpense = 0;
    income.forEach(ele => {
      totalIncome += Number(ele.amount);
    });
    expense.forEach(ele => {
      totalExpense += Number(ele.amount);
    });
    var balance = totalIncome - totalExpense;
    res.render("dashborad",{totalIncome,totalExpense,balance,month});
  }
});

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
 User.create(req.body, (err,user) => {
   if(err){
     res.redirect('/users/register');
   } else {
     res.redirect('/users/login');
   }
 })
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
        return res.redirect("/users");
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
