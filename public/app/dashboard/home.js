angular
    .module('app')
    .controller('DashboardHomeController', DashboardHomeController);

DashboardHomeController.$inject = ['$rootScope', '$http'];

function DashboardHomeController($rootScope, $http){
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
    vm.user_carids = null;
    vm.car_details = [];
    vm.car_details_full = null;
    vm.username = '';
    vm.total_user_vehicle = 0;
    vm.view_specific_vehicle = view_specific_vehicle;
    vm.index = 0;
    
    angular.element(document).ready(function () {
        $rootScope.admin_page = false;
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

    function map_initialize(){
        setTimeout(function(){ google.maps.event.trigger(map, "resize") }, 100);
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
    
    function gps_getpos(carid){
        return $http.post('/api/gps_getpos', {'carid' : carid})
    }
    
    function car_getall(username){
        return $http.post('/api/car_getall', {'username' : username})
    }
    
    function user_getinfo(username){
        return $http.post('/api/user_getinfo', {'username' : username})
    }
    
    function user_getallgroupcars(username){
        return $http.post('/api/user_getgroupcars', {'username' : username})
    }
    
    function user_login(username, userpass){
        return $http.post('/api/login', {'username' : username, 'userpass' : userpass})
    }
    
    function tree_groupcars(){
        return $http.get('/api/tree_groupcars')
    }
    
    user_login('sa','1234').then(function(result){
        var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
        vm.username = result.data.users[0].username;
        vm.total_user_vehicle = result.data.vechileinfos.length
        setInterval(function(){ 
            full_car_details(vm.username);            
        }, 3000);
    })
    
    
    function full_car_details(username){
         user_getinfo(username).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            
            //set user details
            vm.user = result.data[0];
                    
            //remove last string (')
            vm.user.carids = vm.user.carids.substring(0, vm.user.carids.length-1);
            
            //set into an array
            vm.user_carids = vm.user.carids.split(',');
            
            //get cars basic details
            var requests = 0;
            for(var i = 0; i < vm.user_carids.length; i++){
                requests++;
                gps_getpos(vm.user_carids[i]).then(function(result){
                    requests--;
                    if(vm.car_details.length < vm.total_user_vehicle){
                        vm.car_details.push(JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1")))      
                    }
                    if (requests == 0) more_car_details();
                });
            }
            
            //add carNo and driver
            function more_car_details(){        
                car_getall(username).then(function(result){
                    var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var i = 0; i < result.data.length; i++){
                        for(var j = 0; j < vm.car_details.length; j++){
                            if(vm.car_details[j].data[0].carID === result.data[i].carID){
                                vm.car_details[j].data[0].carNO = result.data[i].carNO
                                vm.car_details[j].data[0].driver = result.data[i].driver
                            }
                        }
                    }
                    var requests = 0;
                    function car_address(i) {
                        if( i < vm.car_details.length ) {
                            requests++;
                            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+vm.car_details[i].data[0].la+','+vm.car_details[i].data[0].lo+'&sensor=true')
                            .success(function(map){
                                requests--;
                                if(map.status === 'ZERO_RESULTS'){
                                    vm.car_details[i].data[0].address = '';
                                }else{
                                    vm.car_details[i].data[0].address = map.results[0].formatted_address;
                                }
                                car_address(i+1)
                                if (requests == 0) car_group_attribute();
                            })
                        }
                    }
                    car_address(0);                
                });
            }
            
            //add group details
            function car_group_attribute(){
                tree_groupcars().then(function(result){
                    var tree_groupcar = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var i = 0; i < tree_groupcar[0].children.length; i++){
                        for(var j = 0; j < vm.car_details.length; j++){
                            if(vm.car_details[j].data[0].carID === tree_groupcar[0].children[i].children[0].objid){
                                vm.car_details[j].data[0].group = tree_groupcar[0].children[i].text
                            }
                        }
                    }
                    vm.car_details_full = vm.car_details;
                    console.log(vm.car_details_full)
                })
            }
        });
    }
    
    function view_specific_vehicle(index){
        $('ul.tabs').tabs('select_tab', 'carmapping');
        map_initialize()
        vm.index = index
    }
   
}