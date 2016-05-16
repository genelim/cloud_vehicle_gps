//Database schema for refuel cost value
module.exports = function (connection) {
  	var mongoose    = require('mongoose'),
        Schema      = mongoose.Schema;

  	var fuel_management = new mongoose.Schema({
        carID           : String,
		max_resistance 	: Number,
		tank_volume  	: Number,
		created_date  	: { type : Date, default: Date.now }
	});
    
  	return connection.model('Fuel_Management', fuel_management);
}