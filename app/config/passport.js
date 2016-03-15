var LocalStrategy   = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db);


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    //User login authentication
	passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true //allow request to callback
    },
    function(req, username, password, done) { 
        //Search the database if the email existed
        User.findOne({ 'username' :  username }, function(err, user) {
            
            if (err)
                return done(null, {response: 'Server Error'});
                
            //Invalid username or password
            if (!user || !user.validPassword(password))
                return done(null, {response: 'Invalid email or password!'}); 

            return done(null, {response: user});
        });
    }));
};