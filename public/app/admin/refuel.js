angular
    .module('app')
    .controller('AdminRefuelController', AdminRefuelController);

AdminRefuelController.$inject = ['$http', 'Refuel_Cost', '$rootScope'];

function AdminRefuelController($http, Refuel_Cost, $rootScope){ 
    var vm = this;
    vm.cost = null;
    vm.create_cost = create_cost;
    vm.add_modal = add_modal;
    vm.get_cost = get_cost;
    vm.all_cost = null;
    
    function create_cost(){
        if(typeof vm.cost !== 'undefined'){
            var data = {cost : vm.cost, user : $rootScope.user.userName}
            Refuel_Cost.save(data, function(result){
                Materialize.toast('New Cost Added!', 2000);
                $('#new_fuel_cost').closeModal();
                vm.get_cost();
            })
        }else{
            Materialize.toast('Enter Fuel Cost', 2000);
        }
    }
    
    function get_cost(){
        Refuel_Cost.query(function(result){
            vm.all_cost = result.response
        })
    }
    
    vm.get_cost();
     
    function add_modal(){
        $('#new_fuel_cost').openModal();
    }
}