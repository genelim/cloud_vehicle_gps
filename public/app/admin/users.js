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
    vm.usergroup_view_modal = usergroup_view_modal;
    vm.group_save_user = group_save_user;
    vm.user_group = [];
    vm.selected_group_user = []
    
    angular.element(document).ready(function () {
        // $('.modal-trigger').leanModal();
        get_users();
        $('.dropdown-button').dropdown();
        $('.tooltipped').tooltip({delay: 50});
    });
    
    function group_save_user(username, groups){
        var data = {username : null, groupid: [], can_add: [], can_edit: [], can_car_show: [], can_del: [], can_car_add: [], can_car_edit: [], can_car_del: []}
        data.username = username
        for(var i = 0; i < groups.length; i++){
            if(groups[i].check){
                data.groupid.push(groups[i].id)
                data.can_add.push('true')
                data.can_edit.push('true')
                data.can_del.push('true')
                data.can_car_show.push('true')
                data.can_car_add.push('true')
                data.can_car_edit.push('true')
                data.can_car_del.push('true')
            }            
        }        
        console.log(data)
        API_Data.user_savegroups(data).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(result.success){
                get_users();
                Materialize.toast('User Group Modified!', 2000);
                $('#usergroup_edit_modal').closeModal();    
            }
        })
    }
    
    function register(opaction){
        vm.selected = null
        if(opaction === 'add'){
            vm.selected = vm.user
            if($rootScope.user.userName !== 'sa')
                vm.selected.f_username = $rootScope.user.userName
            else
                vm.selected.f_username = 'sa'
        }else{
            vm.selected = vm.user_edit
            vm.selected.username = vm.user_edit.userName
        }
        vm.selected.opaction = opaction
        if(!vm.selected.tel){
            vm.selected.tel = undefined
        }
        if(!vm.selected.password){
            Materialize.toast('Please enter password', 2000);
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
            vm.user_edit = null
            vm.user = null
            get_users();
        })
    }
    
    function get_users(){
        vm.user_group = []
        
        API_Data.user_tree().then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));            
            vm.users = [];
            looping_user(result.data)
            function looping_user(data){
                for(var i = 0; i < data.length; i++){
                    vm.users.push(data[i])
                    if(data[i].children.length){
                        looping_user(data[i].children)
                    }
                }
            }
            
            var request = 0;
            function user_grouping(i){
                if(i < vm.users.length){
                    request++
                    API_Data.user_getgroups({username: vm.users[i].username}).then(function(result){
                        var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));  
                        vm.user_group.push({result : result.rows, username : vm.users[i].username}); 
                        user_grouping(i+1)    
                        request --
                        if(request === 0){
                            grouping_completed();
                        } 
                    })
                }
            }
            user_grouping(0)
        })
    }

    function grouping_completed(){
        console.log(vm.user_group)
        //loaded everything
    }
    
    function add_modal(){
        $('#user_registration_modal').openModal();
    }
    
    function user_view_modal(details){
        API_Data.user_get(details.username).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            vm.user_edit = result.data
            $('#user_edit_modal').openModal();            
        })
    }
    
    function user_delete(username){
        API_Data.user_del(username).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            get_users();
            $('#user_edit_modal').closeModal();
        })
    }
    
    function usergroup_view_modal(details){
        vm.selected_group_user = []
        API_Data.user_get(details.username).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            vm.user_edit = result.data
            for(var i = 0; i < vm.user_group.length; i++){
                if(vm.user_group[i].username === vm.user_edit.userName){
                    for(var z = 0; z < vm.user_group[i].result.length; z++){
                        vm.selected_group_user.push(vm.user_group[i].result[z].groupid)
                    }
                }
            }      
            
            for(var i =0; i < vm.groups.length; i++){
                vm.groups[i].check = false
            }
            
            for(var i = 0; i < vm.selected_group_user.length; i++){
                for( var a = 0; a < vm.groups.length; a++){
                    if(vm.groups[a].id === vm.selected_group_user[i]){
                        vm.groups[a].check = true;
                    }
                }
            }
            console.log
            $('#usergroup_edit_modal').openModal();    
        })     
    }
    
    get_groups()
    function get_groups(){
         API_Data.groups_tree().then(function(result){
            if(result.data.response === '{"success":false"info":"NOT LOGIN"}'){
                $rootScope.user =false;
                $rootScope.user_check = 2;
                $state.go('home')
            }else{
                var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                vm.groups = [];
                looping_group(result.data)
                function looping_group(data){
                    for(var i = 0; i < data.length; i++){
                        vm.groups.push({title : data[i].title, id : data[i].id, intro: data[i].intro})
                        if(data[i].children.length){
                            looping_group(data[i].children)
                        }
                    }
                }                     
            }                
        })
    }
}