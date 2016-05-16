angular
    .module('app')
    .controller('VehicleMileageController', VehicleMileageController);

VehicleMileageController.$inject = ['API_Data', '$rootScope', '$http'];

function VehicleMileageController(API_Data, $rootScope, $http){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.group = [];
    vm.date = null;
    vm.group_selected = null;
    vm.all_car = []
    vm.get_mileage = get_mileage;
    vm.export_data = export_data;
    vm.per_page = 10;
    vm.fuel_manage=null
    
    function export_data(){
        vm.per_page = vm.all_car.cars.length;
        setTimeout(function() {
            if(document.getElementById('exportable')){
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, 'VIHICLE_MILEAGE -'+new Date()+'.xls');
        }else{
            Materialize.toast('No data available', 2000);            
        } 
        vm.per_page = 10;
        }, 100);        
    }
    
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
            console.log(vm.carid)
            if( i < vm.carid.cars.length ){
                requests++;
                console.log(vm.date,vm.carid.cars[i].carID)
                API_Data.gps_gethistorypos(vm.date, vm.carid.cars[i].carID)
                .then(function(result){
                    requests--;
                    console.log(result)
                    
                    var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var a = 0; a < res.data.length; a++){
                        res.data[a].gpsTime = new Date(res.data[a].gpsTime)
                    }   
                    vm.all_car.cars[i] = []
                    vm.all_car.cars[i].data = []
                    vm.all_car.cars[i].data = res.data
                    vm.all_car.cars[i].plate_number = vm.carid.cars[i].carNO
                    vm.all_car.cars[i].carID = vm.carid.cars[i].carID
                    vm.all_car.cars[i].group = vm.group_selected.group
                    get_car(i+1)
                    if (requests == 0) full_details();
                }) 
            } 
        }        
        get_car(0)
    }
    
    function full_details(){
        for(var i = 0; i < vm.all_car.cars.length; i++){
            var data = vm.all_car.cars[i];
            var last_array_mileage = 0;
            var total_speed_add = 0;
            var current_fuel = null;
            var total_fuel_add = 0;
            var array_length = data.data.length;
            var max_speed = null
            var journey_time = 0
            for(var a = 0; a < data.data.length; a++){
                if(a === data.data.length-1){
                    last_array_mileage = data.data[a].mileage
                }      
                total_speed_add += data.data[a].speed;            
                if(max_speed === null){
                    max_speed = data.data[a].speed
                }else if(data.data[a].speed > max_speed){
                    max_speed = data.data[a].speed;
                } 
                if(current_fuel === null){
                    current_fuel = data.data[a].fuel
                }else if(data.data[a].fuel < current_fuel){
                    console.log(current_fuel - data.data[a].fuel)
                    total_fuel_add += (current_fuel - data.data[a].fuel);  
                    current_fuel = data.data[a].fuel
                }else{
                    current_fuel = data.data[a].fuel
                }          
                if(data.data[a].status.indexOf("ACC off") < 0 && a !== 0){
                    var diff=  Math.abs(data.data[a].gpsTime - data.data[a-1].gpsTime)
                    journey_time += Math.floor((diff/1000)/60);                    
                }
            }
            if(vm.fuel_manage){
                for(var l = 0; l < vm.fuel_manage.length; l++){
                    if(vm.fuel_manage[l].carID.toString() === vm.all_car.cars[i].carID.toString()){
                       vm.all_car.cars[i].fuel_cal = vm.fuel_manage[l].tank_volume/vm.fuel_manage[l].max_resistance;
                    }
                }
            }
            if(typeof data.data[0] !== 'undefined'){
                vm.all_car.cars[i].total_mileage = last_array_mileage - data.data[0].mileage;
            } 
            vm.all_car.cars[i].average_speed = total_speed_add / array_length;
            vm.all_car.cars[i].total_fuel = total_fuel_add;
            vm.all_car.cars[i].fuel_cal = vm.all_car.cars[i].fuel_cal;
            vm.all_car.cars[i].max_speed = max_speed;
            vm.all_car.cars[i].journey_time = journey_time;     
            vm.search_active = false      
        }
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
        $http.get('/api/fuel_managements')
        .success(function(result){
            vm.fuel_manage = result.response
        })
        checkFlag();
    });
}