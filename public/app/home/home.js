angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$http', '$state', '$rootScope', 'Auth'];

function HomeController($http, $state, $rootScope, Auth){ 
    var vm = this;
    vm.login = login;
    vm.forget_password_modal = forget_password_modal;
    vm.user = null;
    if($rootScope.user){
        $state.go('dashboard');
    }    
    
    function login(){
        $http.post('/api/user_login', vm.user)
        .success(function(user){
            if(user.response === 'Invalid email or password!' || user.response === 'Server Error'){
                Materialize.toast(user.response, 2000);
            }else{
                Materialize.toast('Welcome '+user.response.username, 2000);
                $rootScope.user = user;
                $state.go('dashboard');
                $('.dropdown-button').dropdown();
            }
        })
    }

    function forget_password_modal(){
        $('#resetpassword').openModal();
    }
}