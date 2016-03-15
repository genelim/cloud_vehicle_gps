angular
    .module('app')
    .controller('DashboardVehicleTrackingController', DashboardVehicleTrackingController);

DashboardVehicleTrackingController.$inject = [];

function DashboardVehicleTrackingController(){

    function map_initialize(){
        setTimeout(function(){ google.maps.event.trigger(map, "resize") }, 100);
        vm.current_tab = 'map';
    }

}
