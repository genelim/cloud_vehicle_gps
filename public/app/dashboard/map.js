angular
    .module('app')
    .controller('HomeMapController', HomeMapController);

HomeMapController.$inject = ['$rootScope', '$http', 'API_Data', '$state', '$timeout', '$stateParams'];

function HomeMapController($rootScope, $http, API_Data, $state, $timeout, $stateParams){
    var vm = this;
    vm.lat = 0;
    vm.lng = 0;
    vm.plate_number = null
    vm.car_id = null;
    vm.group_update = group_update;
    vm.get_map = get_map;
    vm.plate_number_select = plate_number_select;
    vm.group = []
    vm.carid = null;
    vm.caridz = null;
    vm.map = new google.maps.Map(document.getElementById("map_home"));
    vm.number_wheels = 10;
    vm.marker = new google.maps.Marker(); 
    vm.car_details_full = null  
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        checkFlag();
        var geoSuccess = function(position) {
            startPos = position;
            vm.lat = startPos.coords.latitude;
            vm.lng = startPos.coords.longitude;
            var latlng = new google.maps.LatLng(vm.lat,vm.lng)
            vm.map.setZoom(16);
            vm.map.setCenter(latlng);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
                $('.dropdown-button').dropdown();

    });
    
    function plate_number_select(data){
        vm.plate_number = angular.copy(data)
    }
    
    function group_update(){
        vm.plate_number = null;
        vm.car_id = vm.group_selected.cars
    }
    
    function get_map(){  
        vm.marker.setMap(null);
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
        if(vm.carid && vm.carid !== '' && vm.carid !== null){
            API_Data.gps_getpos(vm.carid).then(function(result){
                vm.car_details = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"))   
                $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+vm.car_details.data[0].la+','+vm.car_details.data[0].lo+'&sensor=true')
                .success(function(map){
                    if(map.status === 'ZERO_RESULTS'){
                        vm.car_details.data[0].address = '';
                    }else{
                        vm.car_details.data[0].address = map.results[0].formatted_address;
                    }
                    API_Data.car_getall($rootScope.user.userName).then(function(result){
                        var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        for(var i = 0; i < result.data.length; i++){
                            if(vm.car_details.data[0].carID === result.data[i].carID){
                                vm.car_details.data[0].carNO = result.data[i].carNO
                                vm.car_details.data[0].driver = result.data[i].driver
                            }
                        }
                        for(var i = 0; i < vm.cars.data.length; i++){
                            if(typeof vm.cars.data[i].cars !== 'undefined'){
                                for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                                    if(vm.cars.data[i].cars[a].carNO === vm.car_details.data[0].carNO){
                                        vm.car_details.data[0].group = vm.cars.data[i].group
                                    }
                                }
                            }
                        }
                        vm.car_details_full = vm.car_details
                        map_initialize()
                    })
                })
            });
        }else{
            Materialize.toast('Please enter valid Plate Number', 2000);
            vm.search_active = false;
        }
    }
    
    function map_initialize(){
        setInterval(function(){ 
            google.maps.event.trigger(vm.map, "resize");
            var myLatLng = {lat: vm.car_details_full.data[0].la, lng: vm.car_details_full.data[0].lo};
            vm.marker.setMap(null);            
            vm.marker = new google.maps.Marker({
                position: myLatLng,
                map: vm.map,
                icon: "/assets/image/car.png",
                title:  vm.car_details_full.data[0].carNO
            }); 
            vm.map.setCenter(myLatLng);
        }, 1500);
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
                            if($stateParams.id){
                                vm.caridz = $stateParams.id
                                get_map();
                            }
                        })
                           
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }   
}