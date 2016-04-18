angular
    .module('app')
    .controller('VehicleMileageController', VehicleMileageController);

VehicleMileageController.$inject = ['API_Data', '$rootScope'];

function VehicleMileageController(API_Data, $rootScope){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.group = [];
    vm.date = null;
    vm.group_selected = null;
    vm.all_car = []
    vm.get_mileage = get_mileage;
    
    angular.element(document).ready(function () {
        vm.loaded = false;
    });
        
    API_Data.tree_groupcars().then(function(result){
        var tree_groupcar = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
        for(var i = 0; i < tree_groupcar[0].children.length; i++){
            vm.group.push({name:tree_groupcar[0].children[i].text_old})
        }
        for(var i = 0; i < tree_groupcar[0].children.length; i++){
            for(var j = 0; j < vm.group.length; j++){
                if(vm.group[j].name === tree_groupcar[0].children[i].text_old){
                    vm.group[j].cars = []
                    for(var a = 0; a < tree_groupcar[0].children[i].children.length; a++){
                        vm.group[j].cars.push({name : tree_groupcar[0].children[i].children[a].text_old, carid : tree_groupcar[0].children[i].children[a].objid, group : tree_groupcar[0].children[i].text_old})
                    }
                }
            }
        }
    })
    
    function get_mileage(){
        vm.vehicle_mileage_full = [];
        vm.search_active = true;
        vm.carid = vm.group_selected;
        if(vm.carid){
            if(vm.date){
                if(typeof vm.date.a !== 'undefined' && vm.date.a !== null){
                    if(typeof vm.date.b !== 'undefined' && vm.date.b !== null){
                        get_car_history()
                    }else{
                        Materialize.toast('Please Enter Date 2', 2000);
                        vm.search_active = false;
                    }
                }else{
                    Materialize.toast('Please Enter Date 1', 2000);                
                    vm.search_active = false;
                }       
            }else{
                Materialize.toast('Please Enter Dates', 2000);                
                vm.search_active = false;
            }
        }else{
            Materialize.toast('Please Select Group', 2000);
            vm.search_active = false;
        }
    }
    function get_car_history(){
        var requests = 0;
        vm.all_car = []
        vm.all_car.cars = []
        
        function get_car(i){
            if( i < vm.carid.cars.length ){
                requests++;
                API_Data.gps_gethistorypos(vm.date, vm.carid.cars[i].carid)
                .then(function(result){
                    requests--;
                    var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var a = 0; a < res.data.length; a++){
                        res.data[a].gpsTime = new Date(res.data[a].gpsTime)
                    }   
                    vm.all_car.cars[i] = []
                    vm.all_car.cars[i].data = []
                    vm.all_car.cars[i].data = res.data
                    vm.all_car.cars[i].plate_number = vm.carid.cars[i]
                    get_car(i+1)
                    if (requests == 0) full_details();
                }) 
            } 
        }        
        get_car(0)
    }
    
    function full_details(){
        console.log(vm.all_car)
    }
    
    function checkFlag() {
        if($rootScope.user_check === 0) {
            window.setTimeout(checkFlag, 1000);
        } else if($rootScope.user_check === 1){
            if($rootScope.user){
                API_Data.car_getall($rootScope.user.userName).then(function(result){
                    var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    vm.cars = result;   
                    console.log(vm.cars)
                    vm.loaded = true;
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        checkFlag();
    });
}