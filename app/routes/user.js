var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db);

exports.get_user = function (req, res) {
	User.find().exec(function(err,user){
        res.json(user);
    })
};

exports.save_user = function (req, res) {
	// req.login(req.user, function(err){
	// 	if(err){
	// 		res.json({response: 'Server Error'})
	// 	}
        // res.json(req.user);
	// })
    User.findOne({ 'username' :  req.body.username }, function(err, user) {
        if (err)
            res.json({response: 'Server Error'});

        //Email taken
        if (user) {
            res.json({response: 'The username is already taken!'});
        } else {
            var new_user = new User();
            new_user.email    = req.body.email;
            new_user.username = req.body.username;
            new_user.password = new_user.generateHash(req.body.password);
            new_user.role.push(req.body.role);
            new_user.note = req.body.note;
            
            new_user.save(function(err, new_user) {
                if (err)
                    res.json({response: 'Server Error'}); 
                    
                res.json({response: new_user});
            });
        }
    });  
};

exports.login_user = function (req, res) {
    console.log(req.user)
	res.json(req.user)
};

exports.check_login = function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
};

exports.user_logout = function(req, res){
	req.logOut();
	res.sendStatus(200);
};