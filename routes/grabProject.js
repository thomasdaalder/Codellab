var express = require('express');
var router = express.Router();
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Create clickable link for unique project links
router.get('/:title', (req, res) => {
  db.Project.findOne({
     where: {
         title: req.params.title
     },
     include: [db.User, db.Comment]
  })
  .then(function (Project) {
    console.log('project include')
    console.log(Project)
    res.render('project', {
      Project: Project,
  	  user: req.session.user,
      paramsID: req.params.title
    })
  })
  .catch(e => console.log(e))
});

// Post comments on the specific Project
router.post('/:title', (req, res) => {
  const userSession = req.session.user;
  db.Project.findOne({
    where: {
      title: req.params.title
    }
  })
  .then(function (project) {
    project.createComment({
      username: req.session.user.username,
      comment: req.body.comment
    })
  })
  .then(function() {
    res.redirect('/project/' + req.params.title);
  })
  .catch(e => console.log(e))
})

module.exports = router;
