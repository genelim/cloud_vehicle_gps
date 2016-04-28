angular
    .module('app')
    .controller('NavigationController', NavigationController);

NavigationController.$inject = ['$http', '$state', 'Auth', '$scope', '$rootScope'];

function NavigationController($http, $state, Auth, $scope, $rootScope){ 
    var vm = this;
    vm.logout = logout;
    vm.open_modal = open_modal;
    vm.open_notification = open_notification;
    vm.disturb = disturb;
  
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
    	$http.post('/api/user_logout', {username : $rootScope.user.username}).success(function(result){
            var result = JSON.parse(result.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
    		if(result.success){
                $('.tooltipped').tooltip('remove');
                $rootScope.user = null;        
                $rootScope.user_check = 3;        
    			$state.go('home');                
    		}else{
    			Materialize.toast('Server Error', 2000);
    		}
    	})
    } 
    
    function open_modal(modal){
        $('#'+modal).openModal();
    }
    
    function open_notification(data, index){
        $rootScope.live_noti -= 1;
        $rootScope.notification.splice(index,1)
        $state.go('dashboard.home.map', {id : data.carid})
    }
    
    function disturb(){
        if($rootScope.disturb_off){
            $rootScope.disturb_off = false;        
        }else{
            $rootScope.disturb_off = true;        
        }        
    }
}