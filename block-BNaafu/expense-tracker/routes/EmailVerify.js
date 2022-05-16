const e = require('express');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var otpGenerator = require('otp-generator');
var email = require("../credentials/email");

var otp = otpGenerator.generate(4, { digits:true, lowerCaseAlphabets:false, upperCaseAlphabets:false,specialChars:false });

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
      res.redirect('/emailverify/verifyotp');
    }
  })
})

// verifyOtp 

router.get('/verifyotp', (req,res,next) => {
  res.render('verifyOtp')
})

router.post('/verifyotp', (req,res,next) => {
  var otp2 = Number(otp);
  var userOtp = req.body.otp;
  if(userOtp == otp2){
    res.redirect('/users/register');
  } else {
    res.redirect('/emailverify');
  }
})

module.exports = router;