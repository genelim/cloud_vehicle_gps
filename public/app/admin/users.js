angular
    .module('app')
    .controller('AdminUserController', AdminUserController);

AdminUserController.$inject = ['$http'];

function AdminUserController($http){ 
    var vm = this;
    vm.user = null;
    vm.register = register;
    vm.users = [];
    
    angular.element(document).ready(function () {
        $('.modal-trigger').leanModal();
    });
    
    function register(){
        console.log(vm.user)
        $http.post('/api/user_register', vm.user, function(users){
            vm.users = users
        })
    }
}