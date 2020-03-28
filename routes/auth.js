var express = require('express');
var router = express.Router();

var passport = require('passport');
var passport_logic = require('../config/passport')(passport);
var User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Will Management' });
});

router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') }); 
});

router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    if (email) {
        const user = await User.findOne({}).where('local.email').equals(email).exec();
        console.log(user);
        if (user) {
            user.lastLogin = new Date();
            await user.save()
        }
    }
    next();
}, passport.authenticate('local-login', {
    successRedirect : '/users', // redirect to the secure profile section
    failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


router.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('signupMessage') }); 
});
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/users', // redirect to the secure profile section
    failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/auth/login');
}

module.exports = router;