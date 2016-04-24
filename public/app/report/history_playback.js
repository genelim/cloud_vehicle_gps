angular
    .module('app')
    .controller('HistoryPlaybackController', HistoryPlaybackController);

HistoryPlaybackController.$inject = ['API_Data', '$rootScope', 'Refuel_Cost', '$state', '$scope', '$http', '$timeout'];

function HistoryPlaybackController(API_Data, $rootScope, Refuel_Cost, $state, $scope, $http, $timeout){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.group = [];
    vm.date = null;
    vm.group_selected = null;
    vm.all_car = []
    vm.get_playback = get_playback;
    vm.per_page = 5;
    var map = new google.maps.Map(document.getElementById("map_home"));
    vm.plate_number = null
    vm.car_id = null;
    vm.group_update = group_update;
    vm.plate_number_select = plate_number_select;
    vm.carid = null;
    vm.play_full = null;
    vm.map = null;
    vm.latlng = []
    vm.ranging = 5;
    vm.play_now = play_now;
    vm.play_stop = play_stop;
    vm.play_pause = play_pause;
    vm.flightPath = new google.maps.Polyline({
        path: vm.latlng,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 10  
    });
    vm.can_play = false;
    vm.play_count = 0;
    vm.marker = new google.maps.Marker();
    
    function loop_playback(i){
        var speed = 1000;
        
        if(vm.ranging == 1){
            speed = 200
        }else if(vm.ranging == 2){
            speed = 400
        }else if(vm.ranging == 3){
            speed = 600
        }else if(vm.ranging == 4){
            speed = 800
        }else if(vm.ranging == 5){
            speed = 1000
        }else if(vm.ranging == 6){
            speed = 1200
        }else if(vm.ranging == 7){
            speed = 1400
        }else if(vm.ranging == 8){
            speed = 1600
        }else if(vm.ranging == 9){
            speed = 1800
        }else if(vm.ranging == 10){
            speed = 2000
        }
                
        if(i < vm.latlng.length){
            vm.play_count = i;
            vm.marker.setMap(null);
            vm.marker = new google.maps.Marker({
                position: vm.latlng[i],
                map: vm.map,
                icon: "/assets/image/car.png",
                title:  'ss'
            }); 
            vm.map.setCenter(vm.latlng[i]);
            $timeout(function() {
                if(vm.can_play){
                    loop_playback(i + 1);                
                }
            }, speed);
        }else{
            if(i ===  vm.latlng.length){
                vm.play_count = 0;
            }
            vm.can_play = false;
        }
    }
    
    function group_update(){
        vm.car_id = vm.group_selected.cars
    }
    
    function get_playback(){
        vm.map = map        
        vm.play_full = [];
        vm.marker.setMap(null);
        vm.can_play = false;
        vm.flightPath.setMap(null)
        vm.carid = null;
        vm.group = []
        vm.search_active = true;
        if(vm.group_selected){
            for(var i = 0; i < vm.group_selected.cars.length; i++){
                if(vm.plate_number.carNO === vm.group_selected.cars[i].carNO){
                    vm.carid = vm.plate_number.carID;
                }
            }
        }else if(!vm.plate_number){
            vm.carid = null;
        }else{
            //type ownself so need to get the id manually
            for(var i = 0; i < vm.cars.data.length; i++){
                if(typeof vm.cars.data[i].cars !== 'undefined'){
                    vm.group.push(vm.cars.data[i])
                    for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                        if(vm.cars.data[i].cars[a].carNO === vm.plate_number.carNO){
                            vm.carid = vm.cars.data[i].cars[a].carID
                        }
                    }
                }
            }
            // alert(vm.plate_number.carNO)
        }
        if(vm.carid && vm.carid !== '' && vm.carid !== null){
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
            Materialize.toast('Please enter valid Plate Number', 2000);
            vm.search_active = false;
        }
    }
    function play_stop(){
        vm.can_play = false;
        vm.play_count = 0
    }
    function play_pause(){
        vm.can_play = false;
    }
    function play_now(){
        vm.can_play = true;
        loop_playback(vm.play_count);
    }
    
    function get_car_history(){
        API_Data.gps_gethistorypos(vm.date, vm.carid)
        .then(function(result){
            var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(res.data.length){
                for(var i = 0; i < res.data.length; i++){
                    res.data[i].gpsTime = new Date(res.data[i].gpsTime)
                }
                console.log(res.data)
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
                                res.data[i].address = map.results[0].formatted_address;
                            }
                            car_address(i+1)
                            if (requests == 0) {
                                vm.play_full = res.data
                                vm.play_full.no = true
                                vm.latlng = []
                                for(var x = 0; x < vm.play_full.length; x++){
                                    vm.latlng.push({lat: vm.play_full[x].la, lng: vm.play_full[x].lo})                               
                                }
                                vm.flightPath = new google.maps.Polyline({
                                    path: vm.latlng,
                                    geodesic: true,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 5  
                                });
                                console.log(vm.map)
                                vm.flightPath.setMap(vm.map)
                                vm.can_play = true;
                            }
                        })
                    }
                }    
                car_address(0)
            }else{
                vm.search_active = false;
                vm.play_full = [];
                vm.play_full.no = true
            }            
        })
    }
    
    function plate_number_select(data){
        vm.plate_number = angular.copy(data)
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
    
    angular.element(document).ready(function () {
        checkFlag();
        var geoSuccess = function(position) {
            startPos = position;
            vm.lat = startPos.coords.latitude;
            vm.lng = startPos.coords.longitude;
            var latlng = new google.maps.LatLng(vm.lat,vm.lng)
            map.setZoom(16);
            map.setCenter(latlng);
        };
        $('.dropdown-button').dropdown();
        navigator.geolocation.getCurrentPosition(geoSuccess);
    });
}