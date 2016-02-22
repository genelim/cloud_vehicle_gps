//Database schema for vehicle details
module.exports = function (connection) {
  	var mongoose    = require('mongoose'),
        Schema      = mongoose.Schema;

  	var vehicle = new mongoose.Schema({
          vehicle_number    : String,
          created_by        : { type: Schema.Types.ObjectId, ref: 'User' },
          created_date      : { type : Date, default: Date.now }
	});
    
  	return connection.model('Vehicle', vehicle);
}