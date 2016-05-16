angular
    .module('app')
    .controller('DrivingRecordsController', DrivingRecordsController);

DrivingRecordsController.$inject = ['$rootScope', 'API_Data', '$http', '$timeout'];

function DrivingRecordsController($rootScope, API_Data, $http, $timeout){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.date = null;
    vm.plate_number = null;
    vm.carid = null;
    vm.get_statistics = get_statistics;
    vm.export_data = export_data;
    vm.driving_records = [];
    vm.driving_records_full = [];
    vm.status = false;
    vm.interval = null;
    vm.per_page = 10;
    vm.group = []
    vm.group_update = group_update
    vm.plate_number_select = plate_number_select
    vm.fuel_manage = null;
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        $http.get('/api/fuel_managements')
        .success(function(result){
            vm.fuel_manage = result.response
        })
        checkFlag();
    });
    
    function export_data(){
        vm.per_page = vm.driving_records_full.data.length;
        setTimeout(function() {
            if(document.getElementById('exportable')){
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, 'DRIVING RECORD-'+new Date()+'.xls');
        }else{
            Materialize.toast('No data available', 2000);            
        } 
        vm.per_page = 10;
        }, 100);        
    }
    function get_statistics(){
        vm.driving_records_full = [];
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
            // console.log(result)
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
                                vm.driving_records_full.data = []
                                vm.driving_records_full.plate_number = vm.cars.data[i].cars[a].carNO
                            }
                        }
                    }
                }
                console.log(vm.driving_records_full)
            }            
        })
    }
    
    function get_car_details(result){
        vm.driving_records = {data : result.data}
        vm.driving_records.total_mileage = 0
        var t_speed = 0
        var t_hours = 0
        var hours = null
        vm.driving_records_full.data = [];
        var dif_minutes_data = null
        
        //check if status is on/off and push respective data 
        for(var i = 0; i < vm.driving_records.data.length; i++){
            if(vm.interval && vm.interval > 0){
                if(!dif_minutes_data){
                    dif_minutes_data = vm.driving_records.data[i].gpsTime
                }else {
                    if((Math.abs(vm.driving_records.data[i].gpsTime - dif_minutes_data) / 36e5*60) > vm.interval){
                        dif_minutes_data = vm.driving_records.data[i].gpsTime
                        if(vm.status){
                            if(vm.driving_records.data[i].status.indexOf("ACC off") < 0){
                                vm.driving_records_full.data.push(vm.driving_records.data[i])
                            }
                        }else{
                            //
                                vm.driving_records_full.data.push(vm.driving_records.data[i])
                            if(vm.driving_records.data[i].status.indexOf("ACC off") > -1){
                            }
                        } 
                    }
                }
            }else if(vm.status){
                if(vm.driving_records.data[i].status.indexOf("ACC off") < 0){
                    vm.driving_records_full.data.push(vm.driving_records.data[i])
                }
            }else{
                //
                    vm.driving_records_full.data.push(vm.driving_records.data[i])
                if(vm.driving_records.data[i].status.indexOf("ACC off") > -1){
                }
            } 
        }
        
        //getting other more details 
        for(var i = 0; i < vm.driving_records_full.data.length; i++){
            t_speed += vm.driving_records_full.data[i].speed;
            if(i !== 0){
                var new_t = Math.abs(vm.driving_records_full.data[i].gpsTime.getSeconds() - vm.driving_records_full.data[i-1].gpsTime.getSeconds());
                t_hours += new_t;
            }
            if(i === vm.driving_records_full.data.length-1){
                vm.driving_records_full.total_mileage = vm.driving_records_full.data[i].mileage - vm.driving_records_full.data[0].mileage
                vm.driving_records_full.t_speed = t_speed/vm.driving_records_full.data.length;
                vm.driving_records_full.t_hours = t_hours/3600
                for(var a = 0; a < vm.cars.data.length; a++){
                    if(typeof vm.cars.data[a].cars !== 'undefined'){
                        for(var j = 0; j < vm.cars.data[a].cars.length; j++){
                            if(vm.cars.data[a].cars[j].carID === vm.driving_records.data[i].carID){
                                vm.driving_records_full.plate_number = vm.cars.data[a].cars[j].carNO
                            }
                        }     
                    }
                }
            }
            if(vm.fuel_manage){
                for(var l = 0; l < vm.fuel_manage.length; l++){
                    if(vm.fuel_manage[l].carID.toString() === vm.driving_records.data[i].carID.toString()){
                        vm.driving_records_full.data[i].fuel_cal = vm.fuel_manage[l].tank_volume/vm.fuel_manage[l].max_resistance
                    }
                }
            }       
        }
        
        //set platenumber with or without data
        for(var i = 0; i < vm.cars.data.length; i++){
            if(typeof vm.cars.data[i].cars !== 'undefined'){
                for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                    if(vm.cars.data[i].cars[a].carID === vm.carid){
                        vm.driving_records_full.plate_number = vm.cars.data[i].cars[a].carNO
                    }
                }
            }
        }
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
}