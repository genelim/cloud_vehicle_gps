angular
    .module('app')
    .controller('DrivingRecordsController', DrivingRecordsController);

DrivingRecordsController.$inject = ['$rootScope', 'API_Data', '$http'];

function DrivingRecordsController($rootScope, API_Data, $http){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.date = null;
    vm.plate_number = null;
    vm.carid = null;
    vm.get_statistics = get_statistics;
    vm.export_data = export_data;
    vm.driving_records = [];
    vm.driving_records_full = [];
    vm.status = false;
    vm.interval = null;
    vm.per_page = 10;
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        checkFlag();
    });
    
    function export_data(){
        vm.per_page = 999999999999;        
        if(document.getElementById('exportable')){            
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Driving_Records.xls");
        }else{
            Materialize.toast('No data available', 2000);            
        } 
        vm.per_page = 10;
    }    
    
    function get_statistics(){
        vm.driving_records_full = [];
        vm.search_active = true;
        vm.carid = null;
        for(var i = 0; i < vm.cars.data.length; i++){
            for(var a = 0; a < vm.cars.data[i].carNO.length; a++){
                if(vm.cars.data[i].carNO[a] === vm.plate_number){
                    vm.carid = vm.cars.data[i].carID[a];
                }
            }            
        }
        if(vm.carid){
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
            Materialize.toast('Invalid Plate Number', 2000);
            vm.search_active = false;
        }
    }
    
    function get_car_history(){
        API_Data.gps_gethistorypos(vm.date, vm.carid)
        .then(function(result){
            var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(res.data.length){
                for(var i = 0; i < res.data.length; i++){
                    res.data[i].gpsTime = new Date(res.data[i].gpsTime)
                }
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
                            if (requests == 0) get_car_details(res);
                        })
                    }
                }    
                car_address(0)
            }else{
                vm.search_active = false;
                for(var i = 0; i < vm.cars.data.length; i++){
                    for(var a = 0; a < vm.cars.data[i].carID.length; a++){
                        if(vm.cars.data[i].carID[a] === vm.carid){
                            vm.driving_records_full.data = []
                            vm.driving_records_full.plate_number = vm.cars.data[i].carNO[a]
                        }
                    }
                }
            }            
        })
    }
    
    function get_car_details(result){
        vm.driving_records = {data : result.data}
        vm.driving_records.total_mileage = 0
        var t_speed = 0
        var t_hours = 0
        var hours = null
        vm.driving_records_full.data = [];
        var dif_minutes_data = null
        
        //check if status is on/off and push respective data 
        for(var i = 0; i < vm.driving_records.data.length; i++){
            if(vm.interval && vm.interval > 0){
                if(!dif_minutes_data){
                    dif_minutes_data = vm.driving_records.data[i].gpsTime
                }else if((vm.driving_records.data[i].gpsTime.getMinutes() - dif_minutes_data.getMinutes()) > vm.interval){
                    dif_minutes_data = vm.driving_records.data[i].gpsTime
                    if(vm.status){
                        if(vm.driving_records.data[i].status !== 'ACC off'){
                            vm.driving_records_full.data.push(vm.driving_records.data[i])
                        }
                    }else{
                        vm.driving_records_full.data.push(vm.driving_records.data[i])
                    } 
                }
            }else if(vm.status){
                if(vm.driving_records.data[i].status !== 'ACC off'){
                    vm.driving_records_full.data.push(vm.driving_records.data[i])
                }
            }else{
                vm.driving_records_full.data.push(vm.driving_records.data[i])
            } 
        }
        
        //getting other more details 
        for(var i = 0; i < vm.driving_records_full.data.length; i++){
            t_speed += vm.driving_records_full.data[i].speed;
            if(i !== 0){
                var new_t = Math.abs(vm.driving_records_full.data[i].gpsTime.getSeconds() - vm.driving_records_full.data[i-1].gpsTime.getSeconds());
                t_hours += new_t;
            }
            if(i === vm.driving_records_full.data.length-1){
                vm.driving_records_full.total_mileage = vm.driving_records_full.data[i].mileage - vm.driving_records_full.data[0].mileage
                vm.driving_records_full.t_speed = t_speed/vm.driving_records_full.data.length;
                vm.driving_records_full.t_hours = t_hours/3600
                for(var a = 0; a < vm.cars.data.length; a++){
                    if(vm.cars.data[a].carID === vm.driving_records.data[i].carID){
                        vm.driving_records_full.plate_number = vm.cars.data[a].carNO
                    }
                }
            }
        }
        
        //set platenumber with or without data
        for(var i = 0; i < vm.cars.data.length; i++){
            if(vm.cars.data[i].carID === vm.carid){
                vm.driving_records_full.plate_number = vm.cars.data[i].carNO
            }
        }
        vm.search_active = false;
    }
    
    function checkFlag() {
        if($rootScope.user_check === 0) {
            window.setTimeout(checkFlag, 1000);
        } else if($rootScope.user_check === 1){
            if($rootScope.user){
                API_Data.tree_groupcars().then(function(result){
                    var result = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    vm.cars = {data : []};
                    for(var i = 0; i < result.length; i++){
                        vm.cars.data.push({group : result[i].text_old, carNO : [], carID :[]});
                        for(var a = 0; a < result[i].children.length; a++){
                            vm.cars.data[i].carNO.push(result[i].children[a].text_old);
                            vm.cars.data[i].carID.push(result[i].children[a].objid);
                        }
                    }
                    vm.loaded = true;
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }
}