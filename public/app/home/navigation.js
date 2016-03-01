angular
    .module('app')
    .controller('NavigationController', NavigationController);

NavigationController.$inject = ['$http', '$state', 'Auth', '$scope', '$rootScope'];

function NavigationController($http, $state, Auth, $scope, $rootScope){ 
    var vm = this;
    vm.logout = logout;
  
    angular.element(document).ready(function(){
        if(!$rootScope.user){
            $state.go('home')
        }
    })
    angular.element(document).ready(function () {
        $('.modal-trigger').leanModal();
    });
    
    function logout(){
    	$http.post('/api/logout').success(function(result){
    		if(result === 'OK'){
                $('.tooltipped').tooltip('remove');
    			$state.go('home');
                $rootScope.user = null;
    		}else{
    			Materialize.toast('Server Error', 2000);
    		}
    	})
    } 
}