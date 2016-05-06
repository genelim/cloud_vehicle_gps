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
        groups_tree : function(){
            return $http.post('/api/groups_tree')
        },
        cars_list : function(groupid){
            return $http.post('/api/cars_list', {groupid : groupid})
        },
        user_save : function(data){
            return $http.post('/api/user_save', data)
        },
        user_getall : function(){
            return $http.post('/api/user_getall')
        },
        user_get : function(username){
            return $http.post('/api/user_get', {username : username})
        },
        user_del : function(username){
            return $http.post('/api/user_del', {username : username})
        },
        groups_save : function(data){
            return $http.post('/api/groups_save', data)
        },
        groups_del : function(data){
            return $http.post('/api/groups_del', data)
        },
        user_savegroups : function(data){
            return $http.post('/api/user_savegroups', data)
        },
        user_getgroups : function(data){
            return $http.post('/api/user_getgroups', data)
        },
        cars_save : function(data){
            return $http.post('/api/cars_save', data)
        },
        cars_del : function(data){
            return $http.post('/api/cars_del', data)
        },
        cars_movetogroup : function(data){
            return $http.post('/api/cars_movetogroup', data)
        }
    }
}