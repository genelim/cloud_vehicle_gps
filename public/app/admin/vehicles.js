angular
    .module('app')
    .controller('AdminVehiclesController', AdminVehiclesController);

AdminVehiclesController.$inject = ['$http', 'API_Data', '$rootScope'];

function AdminVehiclesController($http, API_Data, $rootScope){ 
    var vm = this;
    vm.cars = [];
    checkFlag();
    vm.user = null;
    vm.user_carids = [];
    vm.cars = null;
    vm.car_details = [];
    vm.car_details_full = null;
    vm.total_user_vehicle = [];
    vm.loaded = false;
    vm.groups = null; 
    vm.add_modal = add_modal; 
    vm.register_car = register_car; 
    vm.car = null;
    
    function register_car(){
        vm.car.groupid = vm.car.groupid.id
        vm.car.opaction = 'add'
        API_Data.cars_save(vm.car).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));   
            if(result.msg === 'save data success.'){
                checkFlag();
                Materialize.toast('Vehicle Saved', 2000);                            
            }else if (result.msg === 'save data error. [Data duplication]'){
                Materialize.toast('Vehicle Duplication Error', 2000);                            
            }else{
                Materialize.toast('Server Error', 2000);                                            
            }      
            $('#car_add').closeModal();
        })
    }
    function add_modal(){
        $('#car_add').openModal();
    }
    
    function checkFlag() {
        vm.total_user_vehicle = []
        vm.car_details = []
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
                        //special requests
                        for(var i = 0; i < vm.cars.data.length; i++){
                            if(typeof vm.cars.data[i].cars !== 'undefined'){
                                for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                                    vm.total_user_vehicle.push(vm.cars.data[i].cars[a])
                                }
                            }                            
                        }
                        vm.loaded = true;
                        full_car_details($rootScope.user.userName);   
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }
    function full_car_details(username){
        if(vm.total_user_vehicle.length){
            //get cars basic details
            var requests = 0;
            for(var i = 0; i < vm.total_user_vehicle.length; i++){
                requests++;
                API_Data.gps_getpos(vm.total_user_vehicle[i].carID).then(function(result){
                    requests--;
                    if(vm.car_details.length < vm.total_user_vehicle.length){
                        vm.car_details.push(JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1")))      
                    }
                    if (requests == 0) more_car_details();
                });
            }
        }else{
            // vm.car_details_full = []
        }
        
        //add carNo and driver
        function more_car_details(){
            if($rootScope.user){
                API_Data.car_getall($rootScope.user.userName).then(function(result){
                    var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var i = 0; i < result.data.length; i++){
                        for(var j = 0; j < vm.car_details.length; j++){
                            if(vm.car_details[j].data[0].carID === result.data[i].carID){
                                vm.car_details[j].data[0].carNO = result.data[i].carNO
                                vm.car_details[j].data[0].driver = result.data[i].driver
                            }
                        }
                    }
                    var requestss = 0;
                    function car_address(i) {
                        if( i < vm.car_details.length ) {
                            requestss++;
                            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+vm.car_details[i].data[0].la+','+vm.car_details[i].data[0].lo+'&sensor=true')
                            .success(function(map){
                                requestss--;
                                if(map.status === 'ZERO_RESULTS'){
                                    vm.car_details[i].data[0].address = '';
                                }else{
                                    if(map.results.length){
                                        vm.car_details[i].data[0].address = map.results[0].formatted_address;
                                    }
                                }
                                car_address(i+1)
                                if (requestss == 0) car_group_attribute();
                            })
                        }
                    }
                    car_address(0);                
                });
            }            
        }
        
        //add group details
        function car_group_attribute(){  
            vm.car_details_full = []
            vm.car_details_full = vm.car_details;
            for(var i = 0; i < vm.groups.length; i++){
                if(typeof vm.groups[i].cars !== 'undefined'){
                    for(var a = 0; a < vm.groups[i].cars.length; a++){
                        for(var k = 0; k < vm.car_details.length; k++){
                            if(vm.car_details[k].data[0].carID === vm.groups[i].cars[a].carID){
                                vm.car_details[k].data[0].group = vm.groups[i].group
                            }
                        }
                    }
                    
                }
            }
            console.log(vm.car_details_full)
        }
    }
}