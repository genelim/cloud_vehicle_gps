var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db);

exports.get_user = function (req, res) {
	User.find().exec(function(err,user){
        res.json(user);
    })
};

exports.save_user = function (req, res) {
	req.login(req.user, function(err){
		if(err){
			res.json({response: 'Server Error'})
		}
        res.json(req.user);
	})
};