var express = require('express');
var router = express.Router();
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Matcher', user: req.session.user });
});

module.exports = router;
