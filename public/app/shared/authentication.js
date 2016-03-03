angular
	.module('app')
	.service('Auth', Auth);

Auth.$inject = ['$http', '$q'];

function Auth($http, $q) {
	var defer = $q.defer();

    $http.get('/api/loggedin').then(function(response) {
        console.log(response)
        if(response.data !== '0'){
            $http.post('/api/get_user', response).success(function(r){
                defer.resolve(r);
            })
        }else{
            defer.resolve(response.data)
        }
        
    }, function(response) {
        defer.reject(response);
    });

    return defer.promise;
}