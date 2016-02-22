//Database schema for user details
module.exports = function (connection) {
  	var mongoose    = require('mongoose'),
        bcrypt      = require('bcrypt-nodejs');
    
    var contact = new mongoose.Schema({
        telephone       : Number,
        mobile_number   : Number,
        fax_number      : Number
	});
    
    var address = new mongoose.Schema({
        address: String,
        postcode: String,
        city: String,
        state: String,        
        country: String 
    });
    
  	var user = new mongoose.Schema({
        username         : String,
        email            : String,
        password         : String,
		first_name       : String,
		last_name        : String,
        profile_image    : String,
        contact          : contact,
        address          : address,
        company          : String,
        note             : String,
        role             : [Number],
		updated_date     : Date, 
		created_date     : { type : Date, default: Date.now },
        status           : { type : Boolean, default: false }
	});

    user.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    user.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

  	return connection.model('User', user);
}