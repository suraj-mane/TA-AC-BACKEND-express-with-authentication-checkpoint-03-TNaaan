const { models } = require('mongoose');
var User = require('../model/user');

module.exports = {
  isUserLogged : (req,res,next) => {
    if(req.session.passport && req.session.passport) {
      next();
    } else if(req.session && req.session.userId){
      next();
    }else {  
      res.redirect("/");
    }
  },
  isUserInfo:(req,res,next) => {
    if(req.session.passport){
      var userId = req.session.passport.user;
    } else {
      var userId = req.session.userId;
    }
    if(userId){
      User.findById(userId,"name email",(err,user) => {
        if(err) return next(err)
        req.user = user;
        res.locals.user = user;
        next();
      })
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  }
}