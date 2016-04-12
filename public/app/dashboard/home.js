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

    vm.marker = null;

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
    
    gps_getpos(100111).then(function(result){
        console.log(JSON.parse(result.data.response))
    });
    
    function car_getall(username){
        return $http.post('/api/car_getall', {'username' : username})
    }
    
    car_getall('sa').then(function(result){
        var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
        var date = new Date(result.data[0].joinTime);
        console.log(date)
    });
    
    // function user_getall(){
    //     return $http.post('http://ctserver.dyndns.org:91/data.aspx?action=getalluser')
    // }
    
    // user_getall().then(function(result){
    //     console.log(result.data.response)
    // });
}