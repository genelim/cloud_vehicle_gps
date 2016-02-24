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

    //User registration authentication
    passport.use('local-register', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {

	        User.findOne({ 'username' :  username }, function(err, user) {
	            if (err)
	                return done(null, {response: 'Server Error'});

                //Email taken
	            if (user) {
	                return done(null, {response: 'The username is already taken!'});
	            } else {
	                var new_user = new User();
                    new_user.email    = req.body.email;
	                new_user.username = username;
	                new_user.password = new_user.generateHash(password);
	                new_user.role.push(req.body.role);
	                new_user.note = req.body.note;
                    
	                new_user.save(function(err, new_user) {
	                    if (err)
                            return done(null, {response: 'Server Error'}); 
                            
                        return done(null, {response: new_user});
	                });
	            }
	        });  
        });
    }));
};