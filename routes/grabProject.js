var express = require('express');
var router = express.Router();
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Create clickable link for unique Project links
router.get('/:title', (req, res) => {
  console.log('logging title')
  console.log(req.params.title)
  db.Project.findOne({
     where: {
         title: req.params.title
     },
     include: [db.Comment]
  })
  .then(function (Project) {
    res.render('project', {
      Project: Project,
  	  user: req.session.user,
      paramsID: req.params.title
    })
  })
  .catch(e => console.log(e))
})

module.exports = router;
