angular
    .module('app')
    .controller('NavigationController', NavigationController);

NavigationController.$inject = ['$http', '$state', 'Auth', '$scope', '$rootScope'];

function NavigationController($http, $state, Auth, $scope, $rootScope){ 
    var vm = this;
    vm.logout = logout;
    vm.open_modal = open_modal;
  
    angular.element(document).ready(function(){
        if(!$rootScope.user && $rootScope.user_type !== 0){
            $state.go('home')
        }
        $rootScope.admin_page = false;
    })
    $('.dropdown-test').dropdown({
      inDuration: 300,
      outDuration: 225,
      hover: true, // Activate on hover
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'right' // Displays dropdown with edge aligned to the left of button
    }
  );
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
    
    function open_modal(modal){
        $('#'+modal).openModal();
    }
}