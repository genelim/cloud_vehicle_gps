angular
    .module('app')
    .controller('AdminUserController', AdminUserController);

AdminUserController.$inject = ['User'];

function AdminUserController(User){ 
    var vm = this;
    vm.user = null;
    vm.register = register;
    
    angular.element(document).ready(function () {
        $('.modal-trigger').leanModal();
    });
    
    function register(){
        console.log(vm.user)
        User.save(vm.user, function(user){
            console.log(user)
        })
    }
}