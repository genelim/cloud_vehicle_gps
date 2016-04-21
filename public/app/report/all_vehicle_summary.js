angular
    .module('app')
    .controller('AllVehicleSummaryController', AllVehicleSummaryController);

AllVehicleSummaryController.$inject = ['API_Data', '$rootScope'];

function AllVehicleSummaryController(API_Data, $rootScope){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.group = [];
    vm.date = null;
    vm.group_selected = null;
    vm.all_car = []
    vm.get_summary = get_summary;
    vm.per_page = 10;
    
    function get_summary(){
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
                API_Data.gps_gethistorypos(vm.date, vm.carid.cars[i].carID)
                .then(function(result){
                    requests--;
                    var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var a = 0; a < res.data.length; a++){
                        res.data[a].gpsTime = new Date(res.data[a].gpsTime)
                    }   
                    vm.all_car.cars[i] = []
                    vm.all_car.cars[i].data = []
                    vm.all_car.cars[i].data = res.data
                    vm.all_car.cars[i].plate_number = vm.carid.cars[i].carNO
                    vm.all_car.cars[i].group = vm.group_selected.group
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
        if($rootScope.user_check === 0 && !$rootScope.user) {
            window.setTimeout(checkFlag, 1000);
        } else if($rootScope.user_check === 1){
            if($rootScope.user){
                var requestsss = 0;                
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
                                vm.groups.push({group : data[i].title, id : data[i].id})
                                if(data[i].children.length){
                                    looping_group(data[i].children)
                                }
                            }
                        }
                        
                        car_list(0);                           
                    }
                    
                    function car_list(i) {
                        if( i < vm.groups.length ) {
                            requestsss++;
                            API_Data.cars_list(vm.groups[i].id).then(function(result){
                                requestsss--;
                                var _car = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                                if(_car.totalProperty > 0){                                    
                                    for(var a = 0; a < vm.groups.length; a++){
                                        if(vm.groups[i].id === vm.groups[a].id){
                                            vm.groups[i].cars = _car.rows
                                        }
                                    }
                                }
                                car_list(i+1)
                                if (requestsss == 0) completed_loaded();
                                
                            })
                        }
                    }
                    
                    function completed_loaded(){
                        vm.cars = {data : vm.groups};
                        for(var i = 0; i < vm.cars.data.length; i++){
                            if(typeof vm.cars.data[i].cars !== 'undefined'){
                                vm.group.push(vm.cars.data[i])
                            }
                        }
                        vm.loaded = true;    
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }   
    
    angular.element(document).ready(function () {
        checkFlag();
    });
}