var express = require("express");
const expense = require("../model/expense");
var router = express.Router();
var Expense = require("../model/expense");
var User = require("../model/user");

// expense form 
router.get("/new", (req,res,next) => {
  res.render("expense");
})

// add expense 
router.post("/new", (req,res,next) => {
  req.body.userId = req.user._id;
  req.body.expenseSource = req.body.expenseSource.split(" ");
  Expense.create(req.body, (err,expense) =>{
    if(err) return next(err);
    User.findByIdAndUpdate(req.user._id, {$push:{expenseId:expense._id}}, (err,user) =>{
      res.redirect("/users");
    })  
  })
})

module.exports = router;