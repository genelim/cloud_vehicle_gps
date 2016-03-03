//Database schema for vehicle details
module.exports = function (connection) {
  	var mongoose    = require('mongoose'),
        Schema      = mongoose.Schema;

  	var page_settings = new mongoose.Schema({
			plate_number 	: Boolean,
			driver_name  	: Boolean,
			group_name		: Boolean,
			time    		: Boolean,
			speed    		: Boolean,
			fuel    		: Boolean,
			total_mileage	: Boolean,
			ignition    	: Boolean,
			location    	: Boolean,
			start_time   	: Boolean
	});
    
  	return connection.model('Page_Settings', page_settings);
}