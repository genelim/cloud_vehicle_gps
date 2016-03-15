angular
    .module('app')
    .controller('DashboardVehicleTrackingController', DashboardVehicleTrackingController);

DashboardVehicleTrackingController.$inject = [];

function DashboardVehicleTrackingController(){
    var vm = this;
    vm.number_of_views = 4;
    vm.get_number = get_number;

    angular.element(document).ready(function () {
        for(var i = 0; i < vm.number_of_views; i++){
            var map = new google.maps.Map(document.getElementById("map_home"+i));
            map.setZoom(12);
            map.setCenter({lat: -34.397, lng: 150.644});
        }
    })
    
    function get_number(number){
        return new Array(number);   
    }

}
