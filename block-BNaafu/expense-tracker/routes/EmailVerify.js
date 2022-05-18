const e = require('express');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var otpGenerator = require('otp-generator');
var email = require("../credentials/email");
var EmailOtp = require("../model/emailVerify");
var moment = require("moment");

var date = moment(new Date()).format("h");

var otp = otpGenerator.generate(6, { digits:true, lowerCaseAlphabets:false, upperCaseAlphabets:false,specialChars:false });

// Create Transporte 

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user:process.env.Email, 
    pass:process.env.Password,
  },
});


// Email verifying form 
router.get('/', (req,res,next) => {
  res.render('VerifyEmail');
})

// Send Email
router.post('/', (req,res,next) => {
  email.verifyedemail = req.body.email;
  req.body.otp = otp;
  req.body.otptime = new Date();
  EmailOtp.create( req.body, (err,data) => {
    if(err) return next(err);
    console.log(data);
    var info = {
      form:process.env.Email,
      to:`${req.body.email}`,
      subject:"OTP verify",
      html:
      "<h5>This is your one time password</h5>"+ otp
      }
    
      transporter.sendMail(info, (err,info) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect("/emailverify/" + data.id + "/verifyotp");
        }
      })
  })
})

// verifyOtp 

router.get('/:id/verifyotp', (req,res,next) => {
  var id = req.params.id;
  res.render('verifyOtp',{id})
})

router.post('/:id/verifyotp', (req,res,next) => {
  var userOtp = Number(req.body.otp);
  var id = req.params.id;
  EmailOtp.findById(id, (err,user) =>{
    if(user.otptime){
    user.otpverify(otp, (err,result) => {
      if(err) return next(err);
      if(!result){
        res.redirect("/emailverify");
      } else {
        res.redirect("/users/register");
      }
    })
    }
  })
})

module.exports = router;