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
        user_getgroupcars : function(carid){
            return $http.post('/api/user_getgroupcars', {'username' : username})
        },
        user_login : function(username, userpass){
            return $http.post('/api/login', {'username' : username, 'userpass' : userpass})
        },
        tree_groupcars : function(carid){
            return $http.get('/api/tree_groupcars')
        }
    }
}