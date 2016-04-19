angular
    .module('app')
    .controller('DashboardHomeController', DashboardHomeController);

DashboardHomeController.$inject = ['$rootScope', '$http', 'API_Data', '$state'];

function DashboardHomeController($rootScope, $http, API_Data, $state){
    var vm = this;
    vm.lat = 0;
    vm.lng = 0;
    vm.current_tab = 'list';
    vm.user_setting_modal = user_setting_modal;
    vm.update_setting = update_setting;
    vm.map_initialize = map_initialize;
    vm.initialize = initialize;
    var map = new google.maps.Map(document.getElementById("map_home"));
    vm.number_wheels = 10;
    vm.user = null;
    vm.user_carids = [];
    vm.cars = null;
    vm.car_details = [];
    vm.car_details_full = null;
    vm.total_user_vehicle = [];
    vm.view_specific_vehicle = view_specific_vehicle;
    vm.index = 0;
    vm.groups = null;
    
    angular.element(document).ready(function () {
        $rootScope.admin_page = false;
        checkFlag();
        // var startPos;
        var geoSuccess = function(position) {
            startPos = position;
            vm.lat = startPos.coords.latitude;
            vm.lng = startPos.coords.longitude;
            var latlng = new google.maps.LatLng(vm.lat,vm.lng)
            map.setZoom(16);
            map.setCenter(latlng);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
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
                        //special requests
                        for(var i = 0; i < vm.cars.data.length; i++){
                            if(typeof vm.cars.data[i].cars !== 'undefined'){
                                for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                                    vm.total_user_vehicle.push(vm.cars.data[i].cars[a])
                                }
                            }                            
                        }
                        
                        full_car_details($rootScope.user.userName);          
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }
    
    function map_initialize(){
        setTimeout(function(){ 
            google.maps.event.trigger(map, "resize");
            var myLatLng = {lat: vm.car_details_full[vm.index].data[0].la, lng: vm.car_details_full[vm.index].data[0].lo};
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: "/assets/image/car.png",
                title:  vm.car_details_full[vm.index].data[0].carNO
            }); 
            map.setCenter(myLatLng);
        }, 100);
        vm.current_tab = 'map';
    }
    
    function initialize(){
        vm.current_tab = 'list';
    }
    
    function user_setting_modal(){
        $('#user_setting_modal').openModal();
    }

    function update_setting(){
        $http.put('/api/user_settings', $rootScope.user.response)
        .success(function(result){
            $rootScope.user = result;
            $('#user_setting_modal').closeModal();
        })
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
            vm.car_details_full = []
        }
        
        //add carNo and driver
        function more_car_details(){
            console.log(vm.car_details)
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
                                vm.car_details[i].data[0].address = map.results[0].formatted_address;
                            }
                            car_address(i+1)
                            if (requestss == 0) car_group_attribute();
                        })
                    }
                }
                car_address(0);                
            });
        }
        
        //add group details
        function car_group_attribute(){  
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
        }
    }
    
    //getting specific vehicle and data to view
    function view_specific_vehicle(index){
        $('ul.tabs').tabs('select_tab', 'carmapping');
        map_initialize()
        vm.index = index
    }   
}