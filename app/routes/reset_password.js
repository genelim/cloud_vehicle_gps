var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db),
    nodemailer = require('nodemailer'),
    xoauth2 = require('xoauth2');
    
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'test@cloudtruck.com.my',
            clientId: '54200064884-grait7r71q27aa959o2frplu8qlp5m2d.apps.googleusercontent.com',
            clientSecret: 'xzCHxg0o85_GdltjYPBSxzOe',
            refreshToken: '1/n9afICh4QRGL9AdBBbOfDikV9Rg54wk84Ra9B6Pd1UcMEudVrK5jSpoR30zcRFq6'
        })
    }
});

//token generation
var rand = function() {
    return Math.random().toString(36).substr(2); 
};
var token = function() {
    return rand() + rand(); 
};

exports.send = function (req, res) {
    User.findOne({username : req.body.username})
    .exec(function(err, user){
        if(err){
            res.json({response:'Server Error!'})
        }else if(!user){
            res.json({response:'User not found!'})
        }else if(user){
            var new_token = token();
            var mailOptions = {
                from: '"CloudTruck 👥" <test@cloudtruck.com.my>', 
                to: user.email, 
                subject: 'Reset CloudTruck Password ✔', 
                text: 'Please follow this link to reset your password http:localhost:90/reset_password/'+new_token+' This link expires in 1 hour.',
                html: 'Please follow this link to reset your password <a href="http:localhost:90/reset_password/'+new_token+'"> http:localhost:90/reset_password/'+new_token+'</a> <p> This link expires in 1 hour.</p>'
            };
            user.reset_password = {token : new_token, expiry_date : (Date.now() + 3600000)};
            user.save(function(error, update_user){
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        res.json({response:'Error in sending email. Contact your administrator.'})
                    }else{
                        res.json({response:'Message sent!'})
                    }
                });
            })
            
        }
    })
}

exports.check_token = function(req, res){
    User.findOne({'reset_password.token' : req.params.token, 'reset_password.expiry_date' : {$gt : Date.now()} })
    .exec(function(err, user){
        if(err){
            res.json({response: 'Server Error'})
        }else if(!user){
            res.json({response: 'Expired Link'})
        }else if(user){
            res.json({response: 'Available'})
        }
    })
}

exports.update_password = function(req, res){
    User.findOne({'reset_password.token' : req.body.token, 'reset_password.expiry_date' : {$gt : Date.now()} })
    .exec(function(err, user){
        if(err){
            res.json({response: 'Server Error'})
        }else if(!user){
            res.json({response: 'Expired Link'})
        }else if(user){
            user.password = user.generateHash(req.body.password.new_password);
            user.reset_password = {};
            
            user.save(function(err, updated_user){
                if(err){
                    res.json({response: 'Server Error'})
                }else{
                    res.json({response: 'Updated!'})
                }
            })            
        }
    })
}