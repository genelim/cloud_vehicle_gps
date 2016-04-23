angular
    .module('app')
    .controller('DashboardVehicleTrackingController', DashboardVehicleTrackingController);

DashboardVehicleTrackingController.$inject = ['API_Data', '$rootScope'];

function DashboardVehicleTrackingController(API_Data, $rootScope){
    var vm = this;
    vm.number_of_views = 4;
    vm.get_number = get_number;
    vm.group = [];
    vm.group_selected = group_selected;
    vm.live_vehicle = live_vehicle;
    vm.vehicle_map = vehicle_map;
    vm.cars = [{},{},{},{}];
    vm.cars_preset = [{},{},{},{}];
    vm.loader = [{on:false},{on:false},{on:false},{on:false}];
    vm.map = [{},{},{},{}];
    vm.marker = [{},{},{},{}];
    vm.cars_group = null;
    vm.good_group = [];
    
    function group_selected(group, index){
        vm.cars[index].cars = group.cars;
    }
    
    function live_vehicle(i) {
        if( i < vm.cars_preset.length ) {
            if(typeof vm.cars_preset[i].carID !== 'undefined'){
                API_Data.gps_getpos(vm.cars_preset[i].carID).then(function(result){
                    var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    var latlng = {lat:result.data[0].la, lng: result.data[0].lo}
                    vm.map[i].setZoom(12);
                    vm.map[i].setCenter(latlng);
                    vm.marker[i].setMap(null);
                    vm.marker[i] = new google.maps.Marker({
                        position: latlng,
                        map: vm.map[i],
                        icon: "/assets/image/car.png",
                        title:  vm.cars_preset[i].carNO + ' - ' +  vm.cars_preset[i].carID 
                    }); 
                    vm.live_vehicle(i+1)
                })
            }
        }
    }
    
    function vehicle_map(plate_number, index){
        vm.loader[index].on = true;
        if(plate_number){
            vm.cars_preset[index] = plate_number            
            API_Data.gps_getpos(plate_number.carID).then(function(result){
                var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                var latlng = {lat:result.data[0].la, lng: result.data[0].lo}
                vm.map[index].setZoom(12);
                vm.map[index].setCenter(latlng);
                vm.marker[index] = new google.maps.Marker({
                    position: latlng,
                    map: vm.map[index],
                    icon: "/assets/image/car.png",
                    title:  plate_number.carNO + ' - ' + plate_number.carID 
                }); 
                vm.loader[index].on = false;
            })
        }else{
            vm.loader[index].on = false;
        }        
    }
    
    angular.element(document).ready(function () {
        checkFlag();
        for(var i = 0; i < vm.number_of_views; i++){
            vm.map[i] = new google.maps.Map(document.getElementById("map_home"+i));
            vm.map[i].setZoom(12);
            vm.map[i].setCenter({lat: -34.397, lng: 150.644});
        }
        setInterval(function(){ 
            vm.live_vehicle(0);
        }, 3000);
    })
        
    function get_number(number){
        return new Array(number);   
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
                        vm.cars_group = {data : vm.groups}; 
                        vm.good_group = [] 
                        for(var i = 0; i < vm.cars_group.data.length; i++){
                            if(typeof vm.cars_group.data[i].cars !== 'undefined'){
                                vm.good_group.push(vm.cars_group.data[i])
                            }                      
                        }  
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }
}
