angular
    .module('app')
    .controller('IdleController', IdleController);

IdleController.$inject = ['$rootScope', '$http', 'API_Data'];

function IdleController($rootScope, $http, API_Data){ 
    var vm = this;
    vm.get_idle = get_idle;
    vm.date = null;
    vm.plate_number = null;
    vm.idle = [];
    vm.carid = null;
    vm.get_driver_details = get_driver_details;
    vm.cars = null;
    vm.export_data = export_data;
    vm.search_active = false;
    vm.loaded = false;
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        checkFlag();
    });
    
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
        
    function export_data(){
        if(document.getElementById('exportable')){
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        }else{
            Materialize.toast('No data available', 2000);            
        } 
    }
    
    function get_idle(){
        vm.search_active = true;
        vm.idle = [];
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
                console.log(vm.date)
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
            Materialize.toast('Invalid Plate Number', 2000);
            vm.search_active = false;
        }
    }
    
    function get_car_history(){
        API_Data.gps_gethistorypos(vm.date, vm.carid)
        .then(function(result){
            var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(res.data.length){
                for(var i = 0; i < res.data.length; i++){
                    res.data[i].gpsTime = new Date(res.data[i].gpsTime)
                }
                
                //start is to get the starting point of not moving
                //true is not moving
                //false is first move, so from the true to false is the hours of idle when the status is ON
                var start = true;
                for(var i = 0; i < res.data.length; i++){
                    if(res.data[i].speed === 0 && res.data[i].status !== 'ACC off'){
                        if(start == true){
                            vm.idle.push(res.data[i])   
                            start = false;
                        }
                    }else{
                        if(start === false){
                            vm.idle.push(res.data[i])  
                            start = true;
                        }
                    }
                }
                for(var i = 0; i < vm.idle.length; i++){
                    if(isOdd(i)){
                        vm.idle[i-1].end_date = vm.idle[i].gpsTime
                        vm.idle[i-1].total_hours =  Math.abs(vm.idle[i].gpsTime - vm.idle[i-1].gpsTime) / 36e5;
                    }else if(i === (vm.idle.length - 1)){
                        if(!isOdd(i)){
                            vm.idle[i].end_date = new Date()
                            vm.idle[i].total_hours =  Math.abs(vm.idle[i].end_date - vm.idle[i].gpsTime) / 36e5;
                        }
                    }
                }    
                var requests = 0;
                function car_address(i) {
                    if( i < vm.idle.length ) {
                        requests++;
                        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+vm.idle[i].la+','+vm.idle[i].lo+'&sensor=true')
                        .success(function(map){
                            requests--;
                            if(map.status === 'ZERO_RESULTS'){
                                vm.idle[i].address = '';
                            }else{
                                if(map.results.length){
                                    vm.idle[i].address = map.results[0].formatted_address;
                                }
                            }
                            car_address(i+1)
                            if (requests == 0) vm.get_driver_details();
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
                                vm.idle.driver = vm.cars.data[i].cars[a].driver;
                                vm.idle.driverTel = vm.cars.data[i].cars[a].driverTel;
                                vm.idle.driver2Tel = vm.cars.data[i].cars[a].driver2Tel;
                                vm.idle.carBrand = vm.cars.data[i].cars[a].carBrand;
                                vm.idle.carNO = vm.cars.data[i].cars[a].carNO;
                            }
                        }
                    }
                }
            }
        })
    }
    
    function get_driver_details(){
        for(var j = 0; j < vm.cars.data.length; j++){
            if(typeof vm.cars.data[j].cars !== 'undefined'){
                for(var i = 0; i < vm.cars.data[j].cars.length; i++){
                    if(vm.cars.data[j].cars[i].carNO === vm.plate_number){
                        vm.carid = vm.cars.data[j].cars[i].carID;
                        vm.idle.driver = vm.cars.data[j].cars[i].driver;
                        vm.idle.driverTel = vm.cars.data[j].cars[i].driverTel;
                        vm.idle.driver2Tel = vm.cars.data[j].cars[i].driver2Tel;
                        vm.idle.carBrand = vm.cars.data[j].cars[i].carBrand;
                        vm.idle.carNO = vm.cars.data[j].cars[i].carNO;
                    }
                }
            }
        }
        for(var i = 0; i < vm.idle.length; i++){
            if(!vm.idle[i].end_date){
                vm.idle.splice(i, 1);
            }
        }
    }
    
    function isOdd(num) {
        return num % 2;
    }
}