angular
    .module('app')
    .controller('DashboardVehicleTrackingController', DashboardVehicleTrackingController);

DashboardVehicleTrackingController.$inject = ['API_Data'];

function DashboardVehicleTrackingController(API_Data){
    var vm = this;
    vm.number_of_views = 4;
    vm.get_number = get_number;
    vm.group = [];
    vm.group_selected = group_selected;
    vm.live_vehicle = live_vehicle;
    vm.vehicle_map = vehicle_map;
    vm.cars = [{},{},{},{}];
    vm.cars_preset = [{},{},{},{}];
    vm.loader = [{on:false},{on:false},{on:false},{on:false}];
    vm.map = [{},{},{},{}];
    vm.marker = [{},{},{},{}];
    
    function group_selected(group, index){
        for(var i = 0; i < vm.group.length; i++){
            if(vm.group[i].name === group.name){
                console.log(vm.cars[index])
                vm.cars[index].cars = vm.group[i].cars;
            }
        }
    }
    
    function live_vehicle(i) {
        if( i < vm.cars_preset.length ) {
            if(typeof vm.cars_preset[i].carid !== 'undefined'){
                API_Data.gps_getpos(vm.cars_preset[i].carid).then(function(result){
                    // setMapOnAll(null);
                    var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    var latlng = {lat:result.data[0].la, lng: result.data[0].lo}
                    vm.map[i].setZoom(12);
                    vm.map[i].setCenter(latlng);
                    vm.marker[i].setMap(null);
                    vm.marker[i] = new google.maps.Marker({
                        position: latlng,
                        map: vm.map[i],
                        icon: "/assets/image/car.png",
                        title:  vm.cars_preset[i].name
                    }); 
                    vm.live_vehicle(i+1)
                })
            }
        }
    }
    
    function vehicle_map(plate_number, index){
        vm.loader[index].on = true;
        vm.cars_preset[index] = plate_number[0]
        API_Data.gps_getpos(plate_number[0].carid).then(function(result){
            var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            // vm.map[i] = new google.maps.Map(document.getElementById("map_home"+index));
            var latlng = {lat:result.data[0].la, lng: result.data[0].lo}
            vm.map[index].setZoom(12);
            vm.map[index].setCenter(latlng);
            vm.marker[index] = new google.maps.Marker({
                position: latlng,
                map: vm.map[index],
                icon: "/assets/image/car.png",
                title:  plate_number[0].name
            }); 
            vm.loader[index].on = false;
        })
    }
    
    angular.element(document).ready(function () {
        for(var i = 0; i < vm.number_of_views; i++){
            vm.map[i] = new google.maps.Map(document.getElementById("map_home"+i));
            vm.map[i].setZoom(12);
            vm.map[i].setCenter({lat: -34.397, lng: 150.644});
        }
        setInterval(function(){ 
            vm.live_vehicle(0);
        }, 3000);
    })
    
    API_Data.tree_groupcars().then(function(result){
        var tree_groupcar = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
        for(var i = 0; i < tree_groupcar[0].children.length; i++){
            vm.group.push({name:tree_groupcar[0].children[i].text_old})
        }
        for(var i = 0; i < tree_groupcar[0].children.length; i++){
            for(var j = 0; j < vm.group.length; j++){
                if(vm.group[j].name === tree_groupcar[0].children[i].text_old){
                    vm.group[j].cars = []
                    for(var a = 0; a < tree_groupcar[0].children[i].children.length; a++){
                        vm.group[j].cars.push({name : tree_groupcar[0].children[i].children[a].text_old, carid : tree_groupcar[0].children[i].children[a].objid, group : tree_groupcar[0].children[i].text_old})
                    }
                }
            }
        }
    })
    
    function get_number(number){
        return new Array(number);   
    }

}
