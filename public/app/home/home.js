angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$http', '$state', '$rootScope', 'Auth'];

function HomeController($http, $state, $rootScope, Auth){ 
    var vm = this;
    vm.login = login;
    vm.forget_password_modal = forget_password_modal;
    vm.forget_password = forget_password;
    vm.user = null;
    vm.load = false;
    
    if($rootScope.user){
        $rootScope.admin_page = false;
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
    
    function forget_password(username){
        vm.load = true;
        if(username){
            $http.post('/api/reset_password', {username : username })
            .success(function(value){
                if(value.response === 'Message sent!'){
                    $('#resetpassword').closeModal();
                }
                Materialize.toast(value.response, 2000);
                vm.load = false;
            })
        }
    }
}