var mongoose = require('mongoose'),
    request = require("request"),
    request = request.defaults({jar: true});

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

exports.tree_groupcars = function (req, res) {
    request.get({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=tree_groupcars'}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};


exports.gps_gethistorypos = function (req, res) {
    var postData = {
        'carid': req.body.carid,
        'timestart': req.body.date.a,
        'timeend': req.body.date.b
    };
    request.post({url : 'http://ctserver.dyndns.org:91/data.aspx?action=querygpshistorydata', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};

exports.cars_list = function (req, res) {
    var postData = {
        'groupid': req.body.groupid
    };
    request.post({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=cars_list', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};

exports.cars_save = function (req, res) {
    var postData = {
        'opaction': req.body.opaction,
        'groupid': req.body.groupid,//i
        'carNO': req.body.carNO,
        'simNO': req.body.simNO,
        'machineNO': req.body.machineNO,
        'protocol': req.body.protocol,//i
        'installPlace': req.body.installPlace,//double
        'driver': req.body.driver,
        'driverTel': req.body.driverTel,
        'driverAddress': req.body.groudriverAddresspid,
        'driverRemark': req.body.driverRemark,
        'overServiceTime': req.body.overServiceTime,//date
        'alarmemail' : 0
    };
    console.log(postData)
    request.post({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=cars_save', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};
