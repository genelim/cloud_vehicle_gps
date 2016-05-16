var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    Fuel_Management = require('../models/fuel_management.js')(db);
    
exports.save_update = function (req, res){
    Fuel_Management.findOne({'carid':req.body.carid})
    .exec(function(err, fuel){
        if(err){
            res.json({response:"Server Error"}); 
        }else if(fuel){
            Fuel_Management.findOneAndUpdate({'carid' : req.body.carid},{$set: 
                {   carid: req.body.carid, 
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
            fuel_management.carid = req.body.carid;
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
    Fuel_Management.findOne({'carid':req.body.carid})
    .exec(function(err, fuel){
        if(err){
            res.json({response:"Server Error"}); 
        }else{
            res.json({response: fuel});            
        }
    })
}

