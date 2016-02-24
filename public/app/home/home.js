angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$http','$state'];

function HomeController($http, $state){ 
    var vm = this;
    vm.login = login;
    vm.user = null;
    
    function login(){
        $http.post('/api/user_login', vm.user)
        .success(function(user){
            if(user.response === 'Invalid email or password!' || user.response === 'Server Error'){
                Materialize.toast(user.response, 2000);
            }else{
                Materialize.toast('Welcome '+user.response.username, 2000);
                $state.go('dashboard');
            }
        })
    }
}