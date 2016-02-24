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
        res.json(req.user);
	// })
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