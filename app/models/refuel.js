//Database schema for refuel cost value
module.exports = function (connection) {
  	var mongoose    = require('mongoose'),
        Schema      = mongoose.Schema;

  	var refuel = new mongoose.Schema({
			cost 	: Number,
			user  	: String,
			created_date  	: { type : Date, default: Date.now }
	});
    
  	return connection.model('Refuel', refuel);
}