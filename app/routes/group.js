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

exports.user_savegroups = function (req, res){
    var postData = {
        'username'      : req.body.username,
        'groupid'       : req.body.groupid,
        'can_add'       : req.body.can_add,
        'can_edit'      : req.body.can_edit,
        'can_del'       : req.body.can_del,
        'can_car_show'  : req.body.can_car_show,
        'can_car_add'   : req.body.can_car_add,
        'can_car_edit'  : req.body.can_car_edit,
        'can_car_del'   : req.body.can_car_del
    };
    console.log(postData)
    request.post({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=user_savegroups', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
}

exports.user_getgroups = function (req, res){
    var postData = {
        'username'      : req.body.username
    };
    request.post({url : 'http://ctserver.dyndns.org:91/datalist.aspx?action=user_getgroups', formData : postData}, function(err,httpResponse,body){ 
        if(err){
            res.json({response: "Server Error"})
        }else{
            res.json({response:body})
        }
    })
}

