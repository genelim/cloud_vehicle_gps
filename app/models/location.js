module.exports = function (connection) {
    var mongoose = require('mongoose'),
      	Schema = mongoose.Schema;

    var location = new mongoose.Schema({
		longitude	  : Number,
		latitude	  : Number,
		name		  : String,
		type_marker   : String,
		created_by    : { type: Schema.Types.ObjectId, ref: 'User' }
    });

    return connection.model('Location', location);
}