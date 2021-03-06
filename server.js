var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
    port = process.env.PORT || 90;

require('./app/config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({secret: 'this is cloudtruck', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session()); 

app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

require('./app/routes')(app); 

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
}); 

app.listen(port);
console.log('The magic happens on port '+port);