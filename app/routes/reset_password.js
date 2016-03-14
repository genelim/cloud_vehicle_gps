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
                html: '<a href="http:localhost:90/api/reset_password/'+new_token+'">Click</a> to reset your password. This link expires in 1 day'
            };
            user.reset_password = {token : new_token, expiry_date : Date.now()+1 };
            user.save(function(error, update_user){
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        res.json({response:'Error in sending email. Contact your administrator.'});
                    }else{
                        res.json({response:'Message sent!'});
                    }
                });
            })
            
        }
    })
}