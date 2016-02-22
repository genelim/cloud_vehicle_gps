var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 90;

    
    
app.use(bodyParser.json()); 
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
});    

app.listen(port);
console.log('The magic happens on port '+port);