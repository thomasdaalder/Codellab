var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const userSession = req.session.user
  res.render('index', { title: 'Code Matcher', user: userSession });
});

module.exports = router;
