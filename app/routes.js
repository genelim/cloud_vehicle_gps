var vehicle = require('./routes/vehicle'),
    location = require('./routes/location'),
    reset_password = require('./routes/reset_password'),
    user = require('./routes/user'),
    passport = require('passport');

module.exports = function(app) {
    app.get('/api/vehicle', vehicle.get_vehicle);

    app.get('/api/user', user.get_users);
    app.post('/api/user_login', passport.authenticate('local-login'), user.login_user);
    app.post('/api/user_register', user.save_user);
    app.get('/api/loggedin', user.check_login);
    app.post('/api/logout', user.user_logout);
    app.put('/api/user_settings', user.update_setting);
    app.post('/api/get_user', user.get_user);

    app.get('/api/location', location.get);
    app.post('/api/location', location.add);

    app.post('/api/reset_password', reset_password.send);
    app.get('/api/reset_password/:token', reset_password.check_token);
    app.put('/api/reset_password', reset_password.update_password);
}