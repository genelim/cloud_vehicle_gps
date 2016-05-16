var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    Fuel_Management = require('../models/fuel_management.js')(db);
    
exports.save_update = function (req, res){
    Fuel_Management.findOne({'carID':req.body.carID})
    .exec(function(err, fuel){
        if(err){
            res.json({response:"Server Error"}); 
        }else if(fuel){
            Fuel_Management.findOneAndUpdate({'carID' : req.body.carID},{$set: 
                {   carID: req.body.carID, 
                    max_resistance: 
                    req.body.max_resistance, 
                    tank_volume: req.body.tank_volume   }
                },{upsert:true},function(err){
                    if(err){
                        res.json({response:"Server Error"}); 
                    }else{
                        res.json({response:true}); 
                    }
                });
        }else if(!fuel){
            var fuel_management = new Fuel_Management();
            fuel_management.carID = req.body.carID;
            fuel_management.max_resistance = req.body.max_resistance;
            fuel_management.tank_volume = req.body.tank_volume;
            
            fuel_management.save(function(err, fuel_data){
                if(err){
                    res.json({response:"Server Error"}); 
                }else{
                    res.json({response: fuel_data});
                }
            })
        }
    })
}

exports.get = function (req, res){
    Fuel_Management.findOne({'carID':req.params.id})
    .exec(function(err, fuel){
        if(err){
            res.json({response:"Server Error"}); 
        }else{
            res.json({response: fuel});            
        }
    })
}

exports.gets = function (req, res){
    Fuel_Management.find()
    .exec(function(err, fuel){
        if(err){
            res.json({response:"Server Error"}); 
        }else{
            res.json({response: fuel});            
        }
    })
}

