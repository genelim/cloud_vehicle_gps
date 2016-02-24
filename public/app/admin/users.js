angular
    .module('app')
    .controller('AdminUserController', AdminUserController);

AdminUserController.$inject = ['User_Authentication'];

function AdminUserController(User_Authentication){ 
    var vm = this;
    vm.user = null;
    vm.register = register;
    
    angular.element(document).ready(function () {
        $('.modal-trigger').leanModal();
    });
    
    function register(){
        console.log(vm.user)
        User_Authentication.save(vm.user, function(user){
            console.log(user)
        })
    }
}