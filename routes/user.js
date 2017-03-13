var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Render user signup form (GET)
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// Signup user to database (POST)
router.post('/signup', (req, res) => {
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

// Login Page (GET)
router.get('/signin', (req, res) => {
  res.render('user/signin');
});

// Inlog system that checks if user has filled in the correct username or password (POST)
router.post('/signin', bodyParser.urlencoded({extended: true}), (req, res) => {
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
    bcrypt.compare(req.body.password, user.password, (err, hash) => {
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
router.get('/logout', (req, res) => {
  req.session.destroy(function (error) {
    if(error) {
        throw error;
    }
      res.redirect( '/?message=' + encodeURIComponent("Succesfully logged out.") );
  })
})

// Submit project page (GET)
router.get('/submitproject', (req, res) => {
	res.render('user/submitproject', {user: req.session.user});
});

// Submit project (POST)
router.post('/submitproject', (req, res) => {
  db.User.findOne({
     where: {id: req.session.user.id}
    })
  .then(function(user) {
    return user.createProject({
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
				question: req.body.question,
				language: req.body.language,
				likes: 0
    })
  })
  .then(function() {
    res.redirect('/');
  });
});

module.exports = router;

//Custom Middleware for Logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
}

// Not Logged In
function notLoggedIn(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
}
