var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});