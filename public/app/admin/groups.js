angular
    .module('app')
    .controller('AdminGroupsController', AdminGroupsController);

AdminGroupsController.$inject = ['$http', 'API_Data', '$rootScope'];

function AdminGroupsController($http, API_Data, $rootScope){ 
    var vm = this;
    vm.add_modal = add_modal;
    vm.save_group = save_group;
    vm.group_view_modal = group_view_modal;
    vm.group_delete = group_delete;
    vm.group = null;
    vm.groups = null;
    vm.group_selected = null;

    function add_modal(){
        $('#group_modal').openModal();
    }
    
    function save_group(data){
        if(data === 'add'){
            vm.group.opaction = data
            vm.new_group = vm.group
        }else if(data === 'edit'){
            vm.group_selected.opaction = data            
            vm.new_group = vm.group_selected
        }
        console.log(vm.new_group)
        API_Data.groups_save(vm.new_group).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            console.log(result)
            if(result.msg === 'save data success.'){
                vm.group = null;
                vm.group_selected = null;
                if(data === 'add'){
                    $('#group_modal').closeModal();
                    Materialize.toast('Group Created', 2000);
                }else if(data === 'edit'){
                    $('#group_modal_edit').closeModal();
                    Materialize.toast('Group Edited', 2000);
                }
                get_groups()
            }else{
                Materialize.toast('Error Group', 2000);
            }            
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
    
    function group_view_modal(data){
        vm.group_selected = data
        $('#group_modal_edit').openModal();        
    }
    
    function group_delete(data){
        API_Data.groups_del(data).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(result.success){
                Materialize.toast('Group Deleted', 2000);
                $('#group_modal_edit').closeModal();
            }else{
                Materialize.toast('Error Group Deleted', 2000);
                $('#group_modal_edit').closeModal();
            }
            get_groups()
        })
    }
}