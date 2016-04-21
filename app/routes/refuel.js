var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    Refuel = require('../models/refuel.js')(db);
    
exports.save = function (req, res){
    
    var refuel = new Refuel();
    refuel.cost = req.body.cost;
    refuel.user = req.body.user;
    
    refuel.save(function(err, refuel_data){
        if(err){
            res.json({response:"Server Error"}); 
        }else{
            res.json({response: refuel_data});
        }
    })
}
    
exports.get = function (req, res){
    Refuel.find().exec(function(err, refuel_data){
        if(err){
            res.json({response:"Server Error"}); 
        }else{
            res.json({response: refuel_data});
        }
    })
}