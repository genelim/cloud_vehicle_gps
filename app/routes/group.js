var mongoose = require('mongoose'),
    request = require("request"),
    request = request.defaults({jar: true});

exports.groups_save = function (req, res) {
    var postData = {
        'opaction': req.body.opaction,
        'title': req.body.title,
        'intro': req.body.intro,
        'id': req.body.id
    };
    request.post({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=groups_save', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
};

exports.groups_tree = function (req, res){
    request.get({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=groups_tree'}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
}

exports.groups_del = function (req, res){
    var postData = {
        'id': req.body.id
    };
    request.get({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=groups_del', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
}

