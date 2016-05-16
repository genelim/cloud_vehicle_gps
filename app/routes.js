var vehicle = require('./routes/vehicle'),
    location = require('./routes/location'),
    reset_password = require('./routes/reset_password'),
    user = require('./routes/user'),
    refuel = require('./routes/refuel'),
    group = require('./routes/group'),
    fuel_management = require('./routes/fuel_management'),
    passport = require('passport');

module.exports = function(app) {
    // app.get('/api/vehicle', vehicle.get_vehicle);

    app.get('/api/user', user.get_users);
    app.post('/api/user_login', passport.authenticate('local-login'), user.login_user);
    // app.post('/api/user_register', user.save_user);
    app.get('/api/loggedin', user.check_login);
    app.post('/api/logout', user.user_logout);
    app.put('/api/user_settings', user.update_setting);
    app.post('/api/get_user', user.get_user);
    app.post('/api/user_save', user.user_save);
    app.post('/api/user_getall', user.user_getall);
    app.post('/api/user_get', user.user_get);
    app.post('/api/user_del', user.user_del);

    app.get('/api/location', location.get);
    app.post('/api/location', location.add);

    app.post('/api/reset_password', reset_password.send);
    app.get('/api/reset_password/:token', reset_password.check_token);
    app.put('/api/reset_password', reset_password.update_password);
    
    //Refuel Cost
    app.post('/api/refuel', refuel.save);    
    app.get('/api/refuel', refuel.get);  
    
    //Fuel management
    app.post('/api/fuel_management', fuel_management.save_update);    
    app.get('/api/fuel_management/:id', fuel_management.get);    
    app.get('/api/fuel_managements', fuel_management.gets);    
    
    //Server's API
    app.post('/api/gps_getpos', vehicle.gps_getpos)
    app.post('/api/car_getall', vehicle.car_getall)
    app.post('/api/user_getinfo', user.user_getinfo)
    app.post('/api/user_getgroupcars', user.user_getgroupcars)
    app.post('/api/login', user.login)
    app.post('/api/user_logout', user.user_logout)
    app.get('/api/tree_groupcars', vehicle.tree_groupcars)
    app.post('/api/gps_gethistorypos', vehicle.gps_gethistorypos)
    app.post('/api/user_tree', user.user_tree)
    app.post('/api/get_user_session', user.get_user_session)
    app.post('/api/cars_list', vehicle.cars_list)
    app.post('/api/groups_save', group.groups_save)
    app.post('/api/groups_tree', group.groups_tree)
    app.post('/api/groups_del', group.groups_del)
    app.post('/api/user_savegroups', group.user_savegroups)
    app.post('/api/user_getgroups', group.user_getgroups)
    app.post('/api/cars_save', vehicle.cars_save)
    app.post('/api/cars_del', vehicle.cars_del)
    app.post('/api/cars_movetogroup', vehicle.cars_movetogroup)    
}