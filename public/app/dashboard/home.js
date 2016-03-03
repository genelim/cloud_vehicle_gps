angular
    .module('app')
    .controller('DashboardHomeController', DashboardHomeController);

DashboardHomeController.$inject = ['$rootScope', '$http'];

function DashboardHomeController($rootScope, $http){
    var vm = this;
    vm.lat = 0;
    vm.lng = 0;
    vm.user_setting_modal = user_setting_modal;
    vm.update_setting = update_setting;
    var map = new google.maps.Map(document.getElementById("map"));

    vm.marker = null;

    angular.element(document).ready(function () {
        var startPos;
        var geoSuccess = function(position) {
            startPos = position;
            vm.lat = startPos.coords.latitude;
            vm.lng = startPos.coords.longitude;
            var latlng = new google.maps.LatLng(vm.lat,vm.lng)
            map.setZoom(16);
            map.setCenter(latlng);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
        google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
        });

        function placeMarker(location) {
            var mark = new google.maps.Marker({
                position: location,
                map: map
            });
            vm.marker = {lat : location.lat(), lng:location.lng()};
            $('#add_marker_modal').openModal();
            $('.lean-overlay').click(function(res){
                mark.setMap(null);
            })
        }
        get_marker()
    });

    function get_marker(){
        $http.get('/api/location')
            .then(
                function(callback){
                    // success callback
                    for(var i = 0; i < callback.data.response.length; i++){
                        var LatLng = {
                            lat: callback.data.response[i].latitude,
                            lng: callback.data.response[i].longitude
                        };
                        var marker = new google.maps.Marker({
                            position: LatLng,
                            map: map,
                            title: callback.data.response[i].name
                        });
                        createInfoWindow(marker,
                            'Name: '
                            +callback.data.response[i].name
                            + ' Created By: '
                            + callback.data.response[i].created_by.username
                        );
                    }
                    var infoWindow = new google.maps.InfoWindow();
                    function createInfoWindow(marker, popupContent) {
                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.setContent(popupContent);
                            infoWindow.open(map, this);
                        });
                    }
                },
                function(callback){
                    // failure callback
                    Materialize.toast('Server Error', 2000);
                    console.log(callback)
                }
            );
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
}