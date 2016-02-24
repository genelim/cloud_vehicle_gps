angular
	.module('app')
	.service('Auth', Auth);

Auth.$inject = ['$http', '$q'];

function Auth($http, $q) {
	var defer = $q.defer();

    $http.get('/api/loggedin').then(function(response) {
        defer.resolve(response.data);
    }, function(response) {
        defer.reject(response);
    });

    return defer.promise;
}