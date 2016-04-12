var mongoose = require('mongoose'),
    request = require("request");

exports.gps_getpos = function (req, res) {
	var postData = {
        'carid': req.body.carid
    };

    request.post({url : 'http://ctserver.dyndns.org:91/data.aspx?action=querygpsdata2', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};

exports.car_getall = function (req, res) {
	var postData = {
        'username': req.body.username
    };

    request.post({url : 'http://ctserver.dyndns.org:91/data.aspx?action=getcarlistall', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};