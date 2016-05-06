angular
    .module('app')
    .controller('VariationController', VariationController);

VariationController.$inject = ['API_Data', '$rootScope', '$state', '$http', '$timeout'];

function VariationController(API_Data, $rootScope, $state, $http, $timeout){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.group = [];
    vm.date = null;
    vm.group_selected = null;
    vm.get_variation = get_variation;
    vm.per_page = 10;
    vm.variation_full = [];
    vm.export_data = export_data;
    vm.group = []
    vm.group_update = group_update
    vm.plate_number_select = plate_number_select
    
    function export_data(){
        vm.per_page = vm.variation_full.data.length;
        setTimeout(function() {
            if(document.getElementById('exportable')){
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, 'VARIATION_REFUEL-'+new Date()+'.xls');
        }else{
            Materialize.toast('No data available', 2000);            
        } 
        vm.per_page = 10;
        }, 100);        
    }
    
    function get_variation(){
        vm.variation_full = [];
        vm.search_active = true;
        vm.carid = null;
        if(vm.group_selected){
            if(vm.plate_number){
                for(var i = 0; i < vm.group_selected.cars.length; i++){
                        if(vm.plate_number.carNO === vm.group_selected.cars[i].carNO){
                            vm.carid = vm.group_selected.cars[i].carID;
                        }               
                }
            }else{
                Materialize.toast('Please enter valid Plate Number', 2000);
            }  
        }else if(!vm.plate_number){
            if(vm.caridz){
                vm.carid = vm.caridz;                
            }else{
                vm.carid = null;
            }
        }else if(!vm.carid){
            //type ownself so need to get the id manually
            for(var i = 0; i < vm.cars.data.length; i++){
                if(typeof vm.cars.data[i].cars !== 'undefined'){
                    for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                        if(vm.cars.data[i].cars[a].carNO === vm.plate_number.carNO){
                            vm.carid = vm.cars.data[i].cars[a].carID
                        }
                    }
                }
            }
        }else if(vm.plate_number){
            for(var i = 0; i < vm.cars.data.length; i++){
                if(typeof vm.cars.data[i].cars !== 'undefined'){
                    for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                        if(vm.cars.data[i].cars[a].carNO === vm.plate_number.carNO){
                            vm.carid = vm.cars.data[i].cars[a].carID
                        }
                    }
                }
            }
        }
        
        API_Data.gps_gethistorypos(vm.date, vm.carid)
        .then(function(result){
            var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(res.data.length){
                for(var i = 0; i < res.data.length; i++){
                    res.data[i].gpsTime = new Date(res.data[i].gpsTime)
                }
                var requests = 0;
                function car_address(i) {
                    if( i < res.data.length ) {
                        requests++;
                        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+res.data[i].la+','+res.data[i].lo+'&sensor=true')
                        .success(function(map){
                            requests--;
                            if(map.status === 'ZERO_RESULTS'){
                                res.data[i].address = '';
                            }else{
                                if(map.results.length){
                                    res.data[i].address = map.results[0].formatted_address;
                                }
                            }
                            car_address(i+1)
                            if (requests == 0) get_car_details(res);
                        })
                    }
                }    
                car_address(0)
            }else{
                vm.search_active = false;
                for(var i = 0; i < vm.cars.data.length; i++){
                    if(typeof vm.cars.data[i].cars !== 'undefined'){
                        for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                            if(vm.cars.data[i].cars[a].carID === vm.carid){
                                vm.variation_full.data = []
                                vm.variation_full.plate_number = vm.cars.data[i].cars[a].carNO
                            }
                        }
                    }
                }
                console.log(vm.variation_full)
            }            
        })
    }
    
    function get_car_details(res){
        var base_fuel = 0;
        var refuel = 0;
        for(var i = 0; i < res.data.length; i++){
            if(res.data[i].fuel > base_fuel){
                refuel += res.data[i].fuel - base_fuel;
            }else if(refuel > 0){
                res.data[i].refuel = refuel;
                refuel = 0;
            }
            base_fuel = res.data[i].fuel
        }
        vm.variation_full.data = [];
        console.log(res)
        for(var i = 0; i > res.data.length; i++){
            if(typeof res.data[i].refuel !== 'undefined'){
                vm.variation_full.data.push(res.data[i])
            }
        }
        vm.variation_full.plate_number = vm.plate_number
        vm.search_active = false;
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
                        API_Data.car_getall().then(function(result){
                            var car_list = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                            vm.car_list_all = car_list;
                            vm.cars = {data : vm.groups};
                            for(var i = 0; i < vm.cars.data.length; i++){
                                if(typeof vm.cars.data[i].cars !== 'undefined'){
                                    vm.group.push(vm.cars.data[i])
                                }
                            }
                            vm.loaded = true; 
                            $timeout(function() {
                                $('.dropdown-button').dropdown();
                            }, 100);
                        })
                           
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }  
    
    function plate_number_select(data){
        vm.plate_number = angular.copy(data)
    }
    
    function group_update(){
        vm.plate_number = null;
        vm.car_id = vm.group_selected.cars
    }
    
    angular.element(document).ready(function () {
        checkFlag();
    });
}