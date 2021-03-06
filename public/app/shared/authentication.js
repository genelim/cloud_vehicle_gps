angular
	.module('app')
	.service('Auth', Auth);

Auth.$inject = ['$http', '$q', 'API_Data'];

function Auth($http, $q, API_Data) {
	var defer = $q.defer();

    // $http.get('/api/loggedin').then(function(response) {
    //     if(response.data !== '0'){
    //         $http.post('/api/get_user', response).success(function(r){
    //             defer.resolve(r);
    //         })
    //     }else{
    //         defer.resolve(response.data)
    //     }
        
    // }, function(response) {
    //     defer.reject(response);
    // });
    API_Data.get_user_session().then(function(result){
        if(result.data !== '0'){
            var result = JSON.parse(result.data.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            var result = result.data.userid;
            if(result){
                API_Data.user_getinfo(result).then(function(result2){
                    if(result2.data !== 'Server Error'){
                        var result2 = JSON.parse(result2.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        if(result2.data.length){
                            defer.resolve(result2)
                        }else{
                            defer.resolve(false)
                        }
                    }else{
                        defer.resolve(false)
                    }                    
                })          
            }else{
                defer.resolve(false)
            }
        }else{
            defer.resolve(false)
        }
    })
    return defer.promise;
}