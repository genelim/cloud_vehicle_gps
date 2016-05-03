angular
    .module('app')
    .controller('AdminUserController', AdminUserController);

AdminUserController.$inject = ['$http', 'User', '$rootScope', '$state', 'API_Data'];

function AdminUserController($http, User, $rootScope, $state, API_Data){ 
    var vm = this;
    vm.user = null;
    vm.register = register;
    vm.add_modal = add_modal;
    vm.users = [];
    vm.user_edit = null;
    vm.user_view_modal = user_view_modal;
    vm.user_delete = user_delete;
    
    angular.element(document).ready(function () {
        // $('.modal-trigger').leanModal();
        get_users();
        $('.dropdown-button').dropdown();
        $('.tooltipped').tooltip({delay: 50});
    });
    
    function register(opaction){
        vm.selected = null
        if(opaction === 'add'){
            vm.selected = vm.user
        }else{
            vm.selected = vm.user_edit
            vm.selected.username = vm.user_edit.userName
            console.log(vm.selected)
        }
        vm.selected.opaction = opaction
        if(!vm.selected.tel){
            vm.selected.tel = undefined
        }
        if(!vm.selected.password){
            Materialize.toast('Please enter password', 2000);
            return;
        }
        if(!vm.selected.canmanagechild){
            Materialize.toast('Please Select Role', 2000);
            return;
        }
        if(!vm.selected.email){
            Materialize.toast('Please enter email', 2000);
            return;
        }
        $http.post('/api/user_save', vm.selected)
        .success(function(users){
            if(opaction === 'add'){
                Materialize.toast('User Added!', 2000);
                $('#user_registration_modal').closeModal();
            }else{
                Materialize.toast('User Edited!', 2000);
                $('#user_edit_modal').closeModal();
            }
            get_users();
        })
    }
    
    function get_users(){
        // User.query(function(result){
        //     vm.users = result;
        //     console.log(result)
        // })
        API_Data.user_getall().then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            vm.users = result;
            console.log(vm.users)
        })
    }

    function add_modal(){
        $('#user_registration_modal').openModal();
    }
    
    function user_view_modal(details){
        $('#user_edit_modal').openModal();
        API_Data.user_get(details.userName).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            vm.user_edit = result.data
            
        })
    }
    
    function user_delete(username){
        API_Data.user_del(username).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            console.log(result)
            get_users();
            $('#user_edit_modal').closeModal();
        })
    }
}