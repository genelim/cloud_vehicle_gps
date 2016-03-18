angular
    .module('app')
    .controller('AdminLocationController', AdminLocationController);

AdminLocationController.$inject = ['$http', '$rootScope'];

function AdminLocationController($http, $rootScope){ 
    var vm = this;
    vm.lat = 0;
    vm.lng = 0; 
    vm.add_marker = add_marker;
    vm.marker = null;
    var map = new google.maps.Map(document.getElementById("map"));
    
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
                console.log(vm.marker)
                vm.marker = null;
            })
            $('#add_marker').click(function(){
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
                    var icon = '';
                    if(callback.data.response[i].type_marker === 'toll'){
                        icon = '/assets/image/tollstation.png';
                    }else{
                        icon = '/assets/image/workcase.png'
                    }
                    if(callback.data.response[i].type_marker){
                        var marker = new google.maps.Marker({
                            position: LatLng,
                            map: map,
                            icon: icon,
                            title: callback.data.response[i].name
                        });
                        createInfoWindow(marker, 
                            'Name: '
                            +callback.data.response[i].name 
                            + ' Created By: ' 
                            + callback.data.response[i].created_by.username
                        );
                    }
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
   
    function add_marker(){
        var data = {marker : vm.marker, user : $rootScope.user};
        if( angular.isUndefined(vm.marker) || !vm.marker.type_marker || !vm.marker.name){
            Materialize.toast('Fields cannot be empty', 2000);
            return;
        }
        $http.post('/api/location',data)
            .then(
            function(callback){
                // success callback
                if(callback.data.response === 'Server Error' || callback.data.response === 'Location Existed'){
                    Materialize.toast(callback.data.response, 2000);
                }else{
                    Materialize.toast('Location Added', 2000);
                }   
                vm.marker = null;
                get_marker(); 
            }, 
            function(callback){
                // failure callback
                Materialize.toast('Server Error', 2000);
                console.log(callback)
            }
        );
    }
    
}