angular
    .module('app')
    .controller('NavigationController', NavigationController);

NavigationController.$inject = ['$http', '$location', 'Auth', '$scope', '$rootScope'];

function NavigationController($http, $location, Auth, $scope, $rootScope){ 
    var vm = this;
    vm.logout = logout;
    
    angular.element(document).ready(function () {
        Auth.then(function(data){
            if(data === '0'){
                $location.url('/');
                $rootScope.user = null;
            }else{
                $rootScope.user = data;
            }
        })
    });
    
    function logout(){
    	$http.post('/api/logout').success(function(result){
    		if(result === 'OK'){
    			$location.url('/');
                $rootScope.user = null;
    		}else{
    			Materialize.toast('Server Error', 2000);
    		}
    	})
    } 
    
    // $rootScope.$watch('user', function (value) {
    //     if(value)
    //         $('.dropdown-button').dropdown();
    // }, true);
}