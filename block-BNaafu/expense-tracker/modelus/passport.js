var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../model/user');



passport.use(new GitHubStrategy({
  clientID: process.env.ClinentID,
  clientSecret: process.env.ClinentSecret,
  callbackURL: "/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
 var userData = {
   name:profile.displayName,
   email:profile._json.email,
   verfiedemail:true
 }
 User.findOne({email:profile._json.email}, (err, user) => {
   if(err) return done(err);
   if(!user){
     User.create(userData, (err,newuser) => {
       if(err) return done(err);
       return done(null,newuser);
     })
   }
   return done(null, user)
 })
}
));

// google 
passport.use(new GoogleStrategy({
  clientID: process.env.GClinentID,
  clientSecret: process.env.GClinentSecret,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  var userData = {
    name:profile.displayName,
    verfiedemail:true
  }
  User.findOne({name:profile.displayName}, (err,user) => {
    if(err) return done(err);
    if(!user){
      User.create(userData, (err, newuser) => {
        if(err) return done(err);
        return done(null,newuser);
      })
    }
    return done(null,user);
  })
}
));

passport.serializeUser((user,done) => {
  done(null,user.id);
})

passport.deserializeUser(function(id,done){
  User.findById(id, "name email username", function(err, user) {
    done(err,user);
  })
})