var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Render user signup form
router.get('/signup', function (req, res) {
  res.render('user/signup');
});

// Create user to database
router.post('/signup', function(req, res){
	// Check if Username already exists
	db.User.findOne({where: { username: req.body.username }})
		.then( (user) =>{
			if (user){
				res.redirect('/register?message=' + encodeURIComponent("Username already exists"));
				// Put alert that username already exist
			}
			else {

				var password = req.body.password
				bcrypt.hash(req.body.password, 8, (err, hash)=>{
				db.User.create({
          email: req.body.email,
					username: req.body.username,
					password: hash,
          accounttype: req.body.accounttype
				})
				.then( ()=>{
					res.redirect('/');
					// Alert that user registered worked
					})
				})
			}
	})
});

// GET Login Page
router.get('/signin', function (req, res) {
  res.render('user/signin');
});

// POST Inlog system that checks if user has filled in the correct username or password
router.post('/signin', bodyParser.urlencoded({extended: true}), function (req, res) {
    if(req.body.username.length === 0) {
        res.redirect('/?message=' + encodeURIComponent("Please fill out in your username."));
        return;
    }

    if(req.body.password.length === 0) {
       res.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
       return;
   }

   db.User.findOne({
    where: {
        username: req.body.username
    }
  })
  .then (function (user) {
    bcrypt.compare(req.body.password, user.password, function (err, hash) {
        if (hash === true) {
          req.session.user = user;
          console.log(user);
          res.redirect('/');
        }
        else {
          res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
        }
    });
  });
});

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy(function (error) {
    if(error) {
        throw error;
    }
      res.redirect( '/?message=' + encodeURIComponent("Succesfully logged out.") );
  })
})

module.exports = router;
