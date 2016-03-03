var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db);

exports.get_user = function (req, res) {
	User.find().exec(function(err,user){
        res.json(user);
    })
};

exports.save_user = function (req, res) {
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
            new_user.settings = {
                plate_number    : true,
                driver_name     : true,
                group_name      : true,
                time            : true,
                speed           : true,
                fuel            : true,
                total_mileage   : true,
                ignition        : true,
                location        : true,
                start_time      : true
            };

            new_user.save(function(err, new_user) {
                if (err)
                    res.json({response: 'Server Error'}); 
                    
                res.json({response: new_user});
            });
        }
    });  
};

exports.login_user = function (req, res) {
	res.json(req.user)
};

exports.check_login = function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
};

exports.user_logout = function(req, res){
	req.logOut();
	res.sendStatus(200);
};

exports.get_user = function(req, res){
    User.findOne({_id:req.body.data.response._id}).exec(function(err,user){
        if(err){
            res.json({response:'Server Error'});
        }else{
            console.log(user)
            res.json({response:user});
        }
    })
};

exports.update_setting = function(req, res){
    User.findOne({_id: req.body._id}).exec(function(err,user){
        if(err){
            res.json({response:'Server Error'});
        }else{
            user.settings = req.body.settings
            user.save(function(err,update){
                res.json({response:update});
            })
        }
    })
}