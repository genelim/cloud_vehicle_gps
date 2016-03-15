angular
    .module('app')
    .controller('ResetPasswordController', ResetPasswordController);

ResetPasswordController.$inject = ['$http', '$stateParams', '$rootScope', ];

function ResetPasswordController($http, $stateParams, $rootScope){ 
    var vm = this;
    vm.validated = 0;
    vm.reset_password = reset_password;
  
    angular.element(document).ready(function(){
        $rootScope.user_type = 1;
        check_validity();
    })
    
    function check_validity(){
        $http.post('/api/logout').success(function(result){
    		if(result === 'OK'){
                $rootScope.user = null;
                $http.get('/api/reset_password/'+$stateParams.token).then(function(result){
                    if(result.data.response === 'Available'){
                        vm.validated = 1;
                    }else{
                        vm.validated = 2;
                    }
                })
    		}else{
    			Materialize.toast('Server Error', 2000);
    		}
    	})
    }
    
    function reset_password(password){
        var data = {password : password, token: $stateParams.token}
        $http.put('/api/reset_password', data)
        .success(function(result){
            if(result.response !== 'Server Error' && result.response !== 'Expired Link'){
                vm.validated = 3;
            }else{
                $rootScope.user_type = 0;
                vm.validated = 2;
            }
        })
    }
}