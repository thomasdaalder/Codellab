var express = require('express');
var router = express.Router();
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Create clickable link for unique profile links
router.get('/:username', (req, res) => {
  db.User.findOne({
     where: {
         username: req.params.username
     },
     include: [db.Project]
  })
  .then(function (profile) {
    console.log('profile info')
    console.log(profile)
    res.render('profile', {
      profile: profile,
  	  user: req.session.user,
      profileID: req.params.username
    })
  })
  .catch(e => console.log(e))
});

module.exports = router;
