angular
	.module('app')
	.service('API_Data', API_Data);

API_Data.$inject = ['$http'];

function API_Data($http) {
    return {
        gps_getpos : function(carid){
            return $http.post('/api/gps_getpos', {'carid' : carid})
        },
        car_getall : function(username){
            return $http.post('/api/car_getall', {'username' : username})
        },
        user_getinfo : function(username){
            return $http.post('/api/user_getinfo', {'username' : username})
        },
        user_getgroupcars : function(username){
            return $http.post('/api/user_getgroupcars', {'username' : username})
        },
        user_login : function(username, userpass){
            return $http.post('/api/login', {'username' : username, 'userpass' : userpass})
        },
        tree_groupcars : function(){
            return $http.get('/api/tree_groupcars')
        },
        gps_gethistorypos : function(date, carid){
            return $http.post('/api/gps_gethistorypos', {date : date, carid : carid})
        },
        user_tree : function(){
            return $http.post('/api/user_tree')
        },
        get_user_session : function(){
            return $http.post('/api/get_user_session')
        },
    }
}