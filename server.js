var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
    vehicle = require('./app/routes/vehicle'),
    user = require('./app/routes/user'),
    port = process.env.PORT || 90;

require('./app/config/passport')(passport);
    
app.use(bodyParser.json()); 
app.use(session({secret: 'this is cloudtruck', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.get('/api/vehicle', vehicle.get_vehicle);

app.get('/api/user', user.get_user);
app.post('/api/user_login', passport.authenticate('local-login'), user.login_user);
app.post('/api/user_register', passport.authenticate('local-register'), user.save_user);

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
});    

app.listen(port);
console.log('The magic happens on port '+port);