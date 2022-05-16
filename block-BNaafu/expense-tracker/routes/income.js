var express = require('express');
var router = express.Router();
var Income = require("../model/income");
var User = require("../model/user");

// new income form
router.get("/new", (req,res,next) => {
  res.render("incomeform")
})

// add income 
router.post("/new", (req,res,next) => {
  req.body.userId = req.user._id;
  req.body.incomeSource = req.body.incomeSource.split(" ");
  Income.create(req.body, (err,income) => {
    if(err) return next(err);
    User.findByIdAndUpdate(req.user._id, {$push:{incomeId:income._id}}, (err,user) =>{
      res.redirect("/users");
    })
  })
})


module.exports = router;