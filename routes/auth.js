var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');


async function localAuthUser(email,password,done){
  try{
    const aUser = await User.findOne({email: email});
    if(!aUser){
      return done(null, false);
    }
    const isMatch = await aUser.matchPassword(password);
    if(!isMatch){
      return done(null,false);
    }
    return done(null, aUser);
  } catch(error){
    console.log(error);
    return done(error,false);
  }
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, localAuthUser));

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});