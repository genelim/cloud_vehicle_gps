angular
    .module('app')
    .controller('AdminUserController', AdminUserController);

AdminUserController.$inject = [];

function AdminUserController(){ 
    var vm = this;
    vm.open_modal = open_modal;
    function open_modal(){
        $('#add_user').openModal();
    }
}