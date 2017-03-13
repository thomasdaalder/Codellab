var express = require('express');
var router = express.Router();
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Homepage with all projects
router.get('/', (req, res) => {
  db.Project.findAll({ include: [ db.User ] })
  .then((allProjects) => {
    res.render('index',
    {allProjects: allProjects,
    user: req.session.user
    })
  })
});

module.exports = router;
