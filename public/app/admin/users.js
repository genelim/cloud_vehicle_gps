angular
    .module('app')
    .controller('AdminUserController', AdminUserController);

AdminUserController.$inject = ['$http', 'User', '$rootScope', '$state'];

function AdminUserController($http, User, $rootScope, $state){ 
    var vm = this;
    vm.user = null;
    vm.register = register;
    vm.add_modal = add_modal;
    vm.users = [];
    
    angular.element(document).ready(function () {
        // $('.modal-trigger').leanModal();
        get_users();
        $('.dropdown-button').dropdown();
        $('.tooltipped').tooltip({delay: 50});
    });
    
    function register(){
        console.log(vm.user)
        $http.post('/api/user_register', vm.user)
        .success(function(users){
            Materialize.toast('User Added!', 2000);
            get_users();
            $('#user_registration_modal').closeModal();
        })
    }
    
    function get_users(){
        User.query(function(result){
            vm.users = result;
            console.log(result)
        })
    }

    function add_modal(){
        $('#user_registration_modal').openModal();
    }
}