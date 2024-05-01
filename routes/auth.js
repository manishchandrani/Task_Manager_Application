var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

async function localAuthUser(email, password, done) {
  try {
    const aUser = await User.findOne({ email: email });
    if (!aUser) {
      return done(null, false);
    }
    const isMatch = await aUser.matchPassword(password);
    if (!isMatch) {
      return done(null, false);
    }
    return done(null, aUser);
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, localAuthUser));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

/* POST login page */
router.post('/login/password', [
  body('email').trim().isEmail().normalizeEmail().escape().withMessage('Please enter Email'),
  body('password').trim().notEmpty().escape().withMessage('Please enter Password')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { msg: errors.array() });
  }
  passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/login',
  })(req, res, next);
});


/*POST logut*/
router.post('/logout', function (req, res, next) {
  req.logout(function (error) {
    if (error) { return next(error); }
    res.redirect('/login');
  })
});

/*GET signup form */
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

/* POST signup page */
router.post('/signup', [
  body('name').trim().notEmpty().escape().withMessage('Please enter your name'),
  body('email').trim().isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
  body('password').trim().notEmpty().escape().withMessage('Please enter a password'),
  body('confirmPassword').trim().notEmpty().escape().withMessage('Please confirm your password')
], async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { msg: errors.array() });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.render('signup', { passwordError: "Passwords do not match" });
    }

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    let savedDoc = await newUser.save();

    req.login(savedDoc, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/login');
    });
  } catch (error) {
    return res.render('signup', { error: "Please Enter Valid Email" });
  }
});




module.exports = router;
