angular
    .module('app')
    .controller('FuelConsumptionController', FuelConsumptionController);

FuelConsumptionController.$inject = ['$rootScope', 'API_Data', '$scope'];

function FuelConsumptionController($rootScope, API_Data, $scope){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.date = null;
    vm.plate_number = null;
    vm.carid = null;
    vm.get_fuel = get_fuel;
    vm.fuel_data_full = [];
    vm.cars = null
    vm.data = [];
    vm.labels = [];
    vm.series = ['Speed', 'Fuel'];
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        checkFlag();
    });
        
    function get_fuel(){
        vm.fuel_data_full = [];
        vm.search_active = true;
        vm.carid = null;
        for(var i = 0; i < vm.cars.data.length; i++){
            if(typeof vm.cars.data[i].cars !== 'undefined'){
                for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                    if(vm.cars.data[i].cars[a].carNO === vm.plate_number){
                        vm.carid = vm.cars.data[i].cars[a].carID;
                    }
                }  
            }                      
        }
        if(vm.carid){
            if(vm.date){
                if(typeof vm.date.a !== 'undefined' && vm.date.a !== null){
                    if(typeof vm.date.b !== 'undefined' && vm.date.b !== null){
                        var hours = Math.abs(vm.date.b - vm.date.a) / 36e5;
                        if(hours <= 24){
                            get_car_history()
                        }else{
                           Materialize.toast('Only allows statistic within 1 day', 2000);
                            vm.search_active = false; 
                        }
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
            Materialize.toast('Invalid Plate Number', 2000);
            vm.search_active = false;
        }
    }
    
    function get_car_history(){
        vm.data = [];
        vm.labels = [];       
        API_Data.gps_gethistorypos(vm.date, vm.carid)
        .then(function(result){
            var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(res.data.length){
                for(var i = 0; i < res.data.length; i++){
                    res.data[i].gpsTime = new Date(res.data[i].gpsTime)
                }
                vm.data[0] = [];
                vm.data[1] = [];
                var base_fuel = 0;
                var fuel_consumption = 0;
                for(var i = 0; i < res.data.length; i++){
                    var hours = res.data[i].gpsTime.getHours()
                    var minutes = res.data[i].gpsTime.getMinutes()
                    var seconds = res.data[i].gpsTime.getSeconds()
                    vm.labels.push(hours + ' ' + minutes + ':' +seconds)
                    vm.data[0].push(res.data[i].speed)
                    vm.data[1].push(res.data[i].fuel)
                    if(i === 0){
                        base_fuel = res.data[i].fuel;
                    }else{
                        if(base_fuel !== res.data[i].fuel){
                            if(base_fuel > res.data[i].fuel){
                                fuel_consumption += base_fuel - res.data[i].fuel
                            }
                        }
                    }
                }
                vm.fuel_data_full.plate_number = vm.plate_number;
                vm.fuel_data_full.fuel_consumption = fuel_consumption;
                vm.fuel_data_full.total_mileage = res.data[res.data.length - 1].mileage - res.data[0].mileage;
                vm.search_active = false; 
            }else{
                vm.search_active = false;
                for(var i = 0; i < vm.cars.data.length; i++){
                    if(typeof vm.cars.data[i].cars !== 'undefined'){
                        for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                            if(vm.cars.data[i].cars[a].carID === vm.carid){
                                vm.fuel_data_full.data = []
                                vm.fuel_data_full.plate_number = vm.cars.data[i].cars[a].carNO
                            }
                        }
                    }
                }
                // console.log(vm.fuel_data_full)
                
            }            
        })
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
                        vm.loaded = true;    
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }
}