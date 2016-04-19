angular
    .module('app')
    .controller('DashboardHomeController', DashboardHomeController);

DashboardHomeController.$inject = ['$rootScope', '$http', 'API_Data'];

function DashboardHomeController($rootScope, $http, API_Data){
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
    vm.car_details = [];
    vm.car_details_full = null;
    vm.username = '';
    vm.total_user_vehicle = 0;
    vm.view_specific_vehicle = view_specific_vehicle;
    vm.index = 0;
    
    angular.element(document).ready(function () {
        $rootScope.admin_page = false;
        if($rootScope.user){
            vm.username = $rootScope.user.userName;
            if($rootScope.user.carids){
                vm.total_user_vehicle = $rootScope.user.carids.substring(0, $rootScope.user.carids.length-1).split(',').length;
            }
            full_car_details(vm.username);  
        }
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
         API_Data.user_getinfo(username).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            
            //set user details
            vm.user = result.data[0];
            vm.user_carids = []
            if(vm.user.carids){
                //remove last string (')
                vm.user.carids = vm.user.carids.substring(0, vm.user.carids.length-1);
                
                //set into an array
                vm.user_carids = vm.user.carids.split(',');
            }
            
            if(vm.user_carids.length){
                //get cars basic details
                var requests = 0;
                for(var i = 0; i < vm.user_carids.length; i++){
                    requests++;
                    API_Data.gps_getpos(vm.user_carids[i]).then(function(result){
                        requests--;
                        if(vm.car_details.length < vm.total_user_vehicle){
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
                API_Data.car_getall(username).then(function(result){
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
                API_Data.tree_groupcars().then(function(result){
                    var tree_groupcar = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var i = 0; i < tree_groupcar[0].children.length; i++){
                        for(var j = 0; j < vm.car_details.length; j++){
                            if(vm.car_details[j].data[0].carID === tree_groupcar[0].children[i].children[0].objid){
                                vm.car_details[j].data[0].group = tree_groupcar[0].children[i].text_old
                            }
                        }
                    }
                    vm.car_details_full = vm.car_details;
                })
            }
        });
    }
    
    //getting specific vehicle and data to view
    function view_specific_vehicle(index){
        $('ul.tabs').tabs('select_tab', 'carmapping');
        map_initialize()
        vm.index = index
    }   
}