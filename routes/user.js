var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../models/db.js');
var bodyParser = require('body-parser');
var session = require('express-session');

// Render user signup form (GET)
router.get('/signup', (req, res) => {
  res.render('user/signup', {message: req.flash('usernameTaken')} );
});

// Signup user to database (POST)
router.post('/signup', (req, res) => {
	// Check if Username already exists
	db.User.findOne({where: { username: req.body.username }})
		.then( (user) =>{
      // If username already exists
			if (user){
          req.flash('usernameTaken', 'Username already exists');
          res.redirect('/user/signup');
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
          // req.flash('successRegister', 'Account succesfully registered, you can now sign in');
					res.redirect('/user/signin');
					})
				})
			}
	})
});

// Login Page (GET)
router.get('/signin', (req, res) => {
  res.render('user/signin', {message: req.flash('signinPasswordIncomplete'),
  invalidInfo: req.flash('invalidInfo')});
});

// Inlog system that checks if user has filled in the correct username or password (POST)
router.post('/signin', bodyParser.urlencoded({extended: true}), (req, res) => {
    if(req.body.username.length === 0) {
        req.flash('signinUserIncomplete', 'Please fill in your username.');
        res.redirect('/user/signin');
    }

    if(req.body.password.length === 0) {
        req.flash('signinPasswordIncomplete', 'Please fill out your password.');
        res.redirect('/user/signin');
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
          // res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
          // Redirect and flash message if info isnt correct
          req.flash('invalidInfo', 'Invalid email or password.');
          res.redirect('/user/signin');
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
      res.redirect('/');
  })
})

// Submit project page (GET)
router.get('/submitproject', (req, res) => {
	res.render('user/submitproject', {user: req.session.user,
  doubleProject: req.flash('doubleProject')});
});

// Submit project (POST)
router.post('/submitproject', (req, res) => {
// Find if the project name already exist
  db.Project.findOne({
    where: {
        title: req.body.title
    }
  })
  .then(function(project) {
    if (project === null) {
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
    } else {
      req.flash('doubleProject', 'Project name already exists, please choose a new one.');
      res.redirect('/user/submitproject')
    }
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
