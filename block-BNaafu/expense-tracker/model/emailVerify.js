var mongoose = require("mongoose");
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var emailOrOtp = new schema({
  email:{type:String,require:true},
  otp:{type:String},
  otptime:{type:String}
}, {timestamps:true});

emailOrOtp.pre('save', function(next) {
  if(this.otp && this.isModified("otp")){
    bcrypt.hash(this.otp,10,(err,hash) =>{
      if(err) return next(err);
      this.otp = hash;
      return next();
    })
  } else {
    return next();
  }
})


emailOrOtp.methods.otpverify = function(otp,cb) {
  bcrypt.compare(otp,this.otp, (err,result) => {
    cb(err,result);
  })
}

module.exports = mongoose.model("emailotp", emailOrOtp);