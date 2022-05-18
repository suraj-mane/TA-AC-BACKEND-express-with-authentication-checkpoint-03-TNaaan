var express = require('express');
var router = express.Router();
var User = require('../model/user');
var auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
var email = require("../credentials/email");
var Income = require("../model/income");
var Expense = require("../model/expense");
var moment = require('moment');

let date = moment(new Date()).format("MMM");
let month = moment(new Date()).format("MMM")

router.get('/', auth.isUserLogged, async (req, res, next) => {
  if(req.session && req.session.passport){
    if(req.query.month){
      let currDate = new Date();
      let m = String(req.query.month).split('-')[1];
      let currntYear = moment(currDate).format('YYYY');
      let date = new Date(currntYear + '-' + m + '-' + '01');
      let firstDate = new Date(date.getFullYear(), date.getMonth(),01);
      let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var income = await Income.find({userId: req.user.id, incomeDate:{$gte: new Date(firstDate), $lt: new Date(endDate)}});
      var expense = await Expense.find({userId:req.user.id, expenseDate:{$gte: new Date(firstDate), $lt: new Date(endDate)}});
      var incomes = await Income.distinct("incomeSource");
      var expenses = await Expense.distinct("expenseSource");
      res.render("dashborad",{month,incomes,expenses,income,expense});
    } else if(req.query.start && req.query.end){
      var startDate = req.query.start;
      var endDate = req.query.end;
      var income = await Income.find({userId: req.user.id, incomeDate:{$gte: startDate, $lt: endDate}});
      var expense = await Expense.find({userId:req.user.id, expenseDate:{$gte:startDate, $lt:endDate}});
      var incomes = await Income.distinct("incomeSource");
      var expenses = await Expense.distinct("expenseSource");
      res.render("dashborad",{month,incomes,expenses,income,expense});
    } else if(req.query.incomecategory || req.query.expensecategory){
      var incomecategory = req.query.incomecategory;
      var expensecategory = req.query.expensecategory;
      var income = await Income.find({userId: req.user.id, incomeSource:incomecategory});
      var expense = await Expense.find({userId:req.user.id, expenseSource:expensecategory});
      var incomes = await Income.distinct("incomeSource");
      var expenses = await Expense.distinct("expenseSource");
      res.render("dashborad",{month,incomes,expenses,income,expense});
    } else if(req.query.category && req.query.start && req.query.end){
      var category = req.query.category;
      var start = req.query.start;
      var income = await Income.find({userId:req.user.id,incomeSource:category,incomeDate:{$gte: startDate, $lt: endDate}});
      var expense = await Expense.find({userId:req.user.id, expenseSource:category, expenseDate:{$gte:startDate, $lt:endDate}})
      var incomes = await Income.distinct("incomeSource");
      var expenses = await Expense.distinct("expenseSource");
      res.render("dashborad",{month,incomes,expenses,income,expense});
    } else {
      let currDate = new Date();
      let m = moment(new Date()).format("M");
      let currntYear = moment(currDate).format('YYYY');
      let date = new Date(currntYear + '-' + m + '-' + '01');
      let firstDate = new Date(date.getFullYear(), date.getMonth(),01);
      let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      console.log(firstDate,endDate,m);
      var income = await Income.find({userId: req.user.id, incomeDate:{$gte: new Date(firstDate), $lt: new Date(endDate)}});
      var expense = await Expense.find({userId:req.user.id, expenseDate:{$gte: new Date(firstDate), $lt: new Date(endDate)}});
      var incomes = await Income.distinct("incomeSource");
      var expenses = await Expense.distinct("expenseSource");
      res.render("dashborad",{month,incomes,expenses,income,expense});
    }
  }
});
module.exports = router;