var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/cloud_vehicle'),
    User = require('../models/user.js')(db),
    Vehicle = require('../models/vehicle.js')(db);

exports.get_vehicle = function (req, res) {
	Vehicle.find().exec(function(err,vehicle){
        res.json(vehicle);
    })
};