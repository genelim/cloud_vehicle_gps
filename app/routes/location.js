var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db);
    Location = require('../models/location.js')(db);

exports.add = function (req, res) {
    //create location instant to save
    var newLocation = new Location();
    newLocation.longitude = req.body.marker.lng;
    newLocation.latitude = req.body.marker.lat;
    newLocation.name = req.body.marker.name;
    newLocation.created_by = req.body.user.response._id;
    
    Location.findOne({latitude:req.body.marker.lat,longitude:req.body.marker.lng})
        .exec(function(err,location){
            if(err){
                res.json({response:"Server Error"}); 
            }else if(!location){
                newLocation.save(function(err, result){
                    if(err){
                        res.json({response:"Server Error"}); 
                        return;
                    }else{
                        res.json({response:result});
                    }
                })
            }else{
                res.json({response:"Location Existed"});
            }
        })
}

exports.get = function (req, res){
    Location.find()
        .populate('created_by')
        .exec(function(err, location){
            if(err){
                res.json({response:"Server Error"}); 
            }else{
                res.json({response: location});
            }
        })
}