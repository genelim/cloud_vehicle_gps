angular
    .module('app')
    .controller('AllVehicleSummaryController', AllVehicleSummaryController);

AllVehicleSummaryController.$inject = ['API_Data', '$rootScope', 'Refuel_Cost', '$state', '$http'];

function AllVehicleSummaryController(API_Data, $rootScope, Refuel_Cost, $state, $http){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.group = [];
    vm.date = null;
    vm.group_selected = null;
    vm.all_car = []
    vm.get_summary = get_summary;
    vm.all_car_full = null;
    vm.per_page = 10;
    vm.car_list_all = null;
    vm.export_data = export_data;
    vm.fuel_manage = null;
    
    function export_data(){
        vm.per_page = vm.all_car_full.cars.length;
        setTimeout(function() {
            if(document.getElementById('exportable')){
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, 'ALL_VEHICLE_SUMMARY-'+new Date()+'.xls');
        }else{
            Materialize.toast('No data available', 2000);            
        } 
        vm.per_page = 10;
        }, 100);        
    }
    
    function get_summary(){
        vm.vehicle_mileage_full = [];
        vm.search_active = true;
        vm.carid = vm.group_selected;
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
            Materialize.toast('Please Select Group', 2000);
            vm.search_active = false;
        }
    }
    function get_car_history(){
        var requests = 0;
        vm.all_car = []
        vm.all_car.cars = []
        
        function get_car(i){
            if( i < vm.carid.cars.length ){
                requests++;
                API_Data.gps_gethistorypos(vm.date, vm.carid.cars[i].carID)
                .then(function(result){
                    requests--;
                    var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                    for(var a = 0; a < res.data.length; a++){
                        res.data[a].gpsTime = new Date(res.data[a].gpsTime)
                        if(vm.fuel_manage){
                            for(var l = 0; l < vm.fuel_manage.length; l++){
                                if(vm.fuel_manage[l].carID.toString() === res.data[a].carID.toString()){
                                    res.data[a].fuel_cal = vm.fuel_manage[l].tank_volume/vm.fuel_manage[l].max_resistance
                                }
                            }
                        }  
                    }   
                    vm.all_car.cars[i] = []
                    vm.all_car.cars[i].data = []
                    vm.all_car.cars[i].data = res.data
                    vm.all_car.cars[i].plate_number = vm.carid.cars[i].carNO
                    vm.all_car.cars[i].group = vm.group_selected.group
                    get_car(i+1)
                    if (requests == 0) full_details();
                }) 
            } 
        }        
        get_car(0)
    }
    
    function full_details(){
        Refuel_Cost.query(function(result){
            vm.all_cost = result.response
            vm.all_cost.sort(function(a,b) { 
                return new Date(a.created_date).getTime() - new Date(b.created_date).getTime() 
            });
            for(var i = 0; i < vm.all_car.cars.length; i++){
                var fuel = 0;
                var base_fuel = 0;
                var base_refuel = false;
                var refuel = 0;
                var start = true;
                var card_record_length =  vm.all_car.cars[i].data.length;
                var idle_record = []
                var fuel_cal = 0
                var total_travel = 0;
                for(var a = 0; a < card_record_length; a++){
                    fuel_cal = vm.all_car.cars[i].data[a].fuel_cal
                    if(a === 0){
                        
                    }else  if(vm.all_car.cars[i].data[a].fuel > base_fuel){
                        refuel += vm.all_car.cars[i].data[a].fuel - base_fuel
                    }else if(base_fuel > vm.all_car.cars[i].data[a].fuel){
                        fuel += base_fuel - vm.all_car.cars[i].data[a].fuel
                    }
                    base_fuel = vm.all_car.cars[i].data[a].fuel;  
                    if(vm.all_car.cars[i].data[a].speed === 0 && vm.all_car.cars[i].data[a].status.indexOf("ACC off") < 0){
                        if(start == true){
                            idle_record.push(vm.all_car.cars[i].data[a])   
                            start = false;
                        }
                    }else{
                        if(start === false){
                            idle_record.push(vm.all_car.cars[i].data[a])  
                            start = true;
                        }
                    } 
                    if(vm.all_car.cars[i].data[a].status.indexOf("ACC off") < 0){
                        if(a !== 0){
                            total_travel += Math.abs(vm.all_car.cars[i].data[a].gpsTime - vm.all_car.cars[i].data[a-1].gpsTime) / 36e5;
                        }
                    }                
                    // if(a === 0){
                    //     base_refuel = false;
                    //     base_fuel = vm.all_car.cars[i].data[a].fuel 
                    // }else if(vm.all_car.cars[i].data[a].fuel < base_fuel){
                    //     base_refuel = false;
                    //     fuel += base_fuel - vm.all_car.cars[i].data[a].fuel;
                    //     base_fuel = vm.all_car.cars[i].data[a].fuel;                    
                    // }else if(vm.all_car.cars[i].data[a].fuel > base_fuel){
                    //     if(!base_refuel){
                    //         refuel += vm.all_car.cars[i].data[a].fuel - base_fuel;
                    //     }
                    //     base_refuel = true;
                    //     base_fuel = vm.all_car.cars[i].data[a].fuel;  
                    // }
                    // if(vm.all_car.cars[i].data[a].fuel < base_fuel){
                    //     fuel += base_fuel - vm.all_car.cars[i].data[a].fuel;
                    // }
                    // base_fuel = vm.all_car.cars[i].data[a].fuel;  
                    if(vm.all_car.cars[i].data[a].speed === 0 && vm.all_car.cars[i].data[a].status.indexOf("ACC off") < 0){
                        if(start == true){
                            idle_record.push(vm.all_car.cars[i].data[a])   
                            start = false;
                        }
                    }else{
                        if(start === false){
                            idle_record.push(vm.all_car.cars[i].data[a])  
                            start = true;
                        }
                    } 
                    if(vm.all_car.cars[i].data[a].status.indexOf("ACC off") < 0){
                        if(a !== 0){
                            var diff = Math.abs(vm.all_car.cars[i].data[a].gpsTime - vm.all_car.cars[i].data[a-1].gpsTime)
                            total_travel += Math.floor((diff/1000)/60);
                        }
                    }                
                }
                vm.all_car.cars[i].fuel_used = fuel*fuel_cal;
                vm.all_car.cars[i].total_travel = total_travel;
                if(vm.all_car.cars[i].data.length){
                    vm.all_car.cars[i].carid = vm.all_car.cars[i].data[0].carID;
                }
                vm.all_car.cars[i].refuel = refuel*fuel_cal;
                vm.all_car.cars[i].idle_record = idle_record;
                if(fuel !== 0){
                    console.log(vm.all_car.cars[i].data[card_record_length - 1].mileage - vm.all_car.cars[i].data[0].mileage)
                    vm.all_car.cars[i].kl_l = (vm.all_car.cars[i].data[card_record_length - 1].mileage - vm.all_car.cars[i].data[0].mileage)/fuel;
                }else{
                    vm.all_car.cars[i].kl_l = 0;
                }
            }
            for(var i = 0; i < vm.all_car.cars.length; i++){
                var fuel_cost = 0;
                for(var a = 0; a < vm.all_car.cars[i].data.length; a++){
                    for(var j = 0; j < vm.all_cost.length; j++){
                        var cur_date = new Date(vm.all_cost[j].created_date)
                        var dating = new Date(vm.all_car.cars[i].data.gpsTime)
                        
                        if(j === vm.all_cost.length-1){
                            fuel_cost = vm.all_cost[j].cost;
                            break;
                        }else if(cur_date > dating){ 
                            if(j === 0){
                                fuel_cost = vm.all_cost[j].cost;                                             
                            }else{
                                fuel_cost = vm.all_cost[j - 1].cost;
                            }
                            break;
                        }
                    }
                }
                vm.all_car.cars[i].fuel_total_cost = fuel_cost * vm.all_car.cars[i].fuel_used;
                vm.all_car.cars[i].refuel_cost = fuel_cost * vm.all_car.cars[i].refuel; 
            }
            
            var requests = 0;
            var current_update = []
            for(var i = 0; i < vm.all_car.cars.length; i++){
                requests++;
                if(vm.all_car.cars[i].data.length){
                    API_Data.gps_getpos(vm.all_car.cars[i].carid).then(function(result){
                        requests--;
                        current_update.push(JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1")))
                        if (requests == 0) continue_summary();
                    });
                }else{
                    vm.all_car.cars[i].total_idle_cost = 0
                    vm.all_car.cars[i].total_idle_fuel = 0
                    vm.all_car.cars[i].total_idle_hours = 0
                    for(var i = 0; i < vm.all_car.cars.length; i++){
                        for(var a = 0; a < vm.car_list_all.data.length; a++){
                            if(vm.car_list_all.data[a].carNO === vm.all_car.cars[i].plate_number){
                                vm.all_car.cars[i].driver = vm.car_list_all.data[a].driver
                            }   
                        }
                    }
                    vm.all_car_full = vm.all_car
                    vm.search_active = false;
                }                
            }
            function continue_summary(){
                for(var i = 0; i < vm.all_car.cars.length; i++){
                    vm.all_car.cars[i].total_idle_hours = 0
                    vm.all_car.cars[i].total_idle_cost = 0
                    vm.all_car.cars[i].total_idle_fuel = 0
                    if(typeof vm.all_car.cars[i].idle_record !== 'undefined'){
                        for(var a = 0; a < vm.all_car.cars[i].idle_record.length; a++){
                            if(isOdd(a)){
                                if(vm.all_car.cars[i].idle_record[a-1].fuel  > vm.all_car.cars[i].idle_record[a].fuel){
                                    vm.all_car.cars[i].idle_record[a-1].end_date = vm.all_car.cars[i].idle_record[a].gpsTime;
                                    vm.all_car.cars[i].total_idle_fuel += vm.all_car.cars[i].idle_record[a-1].fuel - vm.all_car.cars[i].idle_record[a].fuel; 
                                    var diff=  Math.abs(vm.all_car.cars[i].idle_record[a].gpsTime - vm.all_car.cars[i].idle_record[a-1].gpsTime);
                                    vm.all_car.cars[i].total_idle_hours += Math.floor((diff/1000)/60);
                                    var idle_cost = 0
                                    for(var j = 0; j < vm.all_cost.length; j++){
                                        var cur_date = new Date(vm.all_cost[j].created_date)
                                        if(j === vm.all_cost.length-1){
                                            idle_cost = vm.all_cost[j].cost;     
                                            break;
                                        }else if(cur_date > vm.all_car.cars[i].idle_record[a].gpsTime){
                                            if(j === 0){
                                                idle_cost = vm.all_cost[j].cost;                                                
                                            }else{
                                                idle_cost = vm.all_cost[j - 1].cost;
                                            }
                                            break;
                                        }
                                    }
                                    vm.all_car.cars[i].total_idle_cost += idle_cost*(vm.all_car.cars[i].idle_record[a-1].fuel - vm.all_car.cars[i].idle_record[a].fuel);
                                }                                
                            }
                            if(a === (vm.all_car.cars[i].idle_record.length - 1)){
                                if(!isOdd(a)){
                                    cur_fuel_used = 0
                                    vm.all_car.cars[i].idle_record[a].end_date = new Date()
                                    for(var z = 0; z < current_update[0].data.length; z++){
                                        if(current_update[0].data[z].carID === vm.all_car.cars[i].carid){
                                            if(vm.all_car.cars[i].idle_record[a].fuel > current_update[0].data[z].fuel ){
                                                vm.all_car.cars[i].total_idle_fuel += vm.all_car.cars[i].idle_record[a].fuel - current_update[0].data[z].fuel 
                                                cur_fuel_used = vm.all_car.cars[i].idle_record[a].fuel - current_update[0].data[z].fuel 
                                            }                                            
                                        }
                                    }
                                    var idle_cost = 0
                                    for(var j = 0; j < vm.all_cost.length; j++){
                                        var cur_date = new Date(vm.all_cost[j].created_date)
                                        if(j === vm.all_cost.length-1){
                                            idle_cost = vm.all_cost[j].cost;     
                                            break;
                                        }else if(cur_date > vm.all_car.cars[i].idle_record[a].gpsTime){
                                            if(j === 0){
                                                idle_cost = vm.all_cost[j].cost;                                                
                                            }else{
                                                idle_cost = vm.all_cost[j - 1].cost;
                                            }
                                            break;
                                        }
                                    }
                                    vm.all_car.cars[i].total_idle_cost += idle_cost*cur_fuel_used;
                                    var diff=  Math.abs(vm.all_car.cars[i].idle_record[a].gpsTime - vm.all_car.cars[i].idle_record[a-1].gpsTime);
                                    vm.all_car.cars[i].total_idle_hours += Math.floor((diff/1000)/60);
                                }
                            }
                        } 
                    }                 
                }
                for(var i = 0; i < vm.all_car.cars.length; i++){
                    for(var a = 0; a < vm.car_list_all.data.length; a++){
                        if(vm.car_list_all.data[a].carNO === vm.all_car.cars[i].plate_number){
                            vm.all_car.cars[i].driver = vm.car_list_all.data[a].driver
                        }   
                    }
                }
                vm.all_car_full = vm.all_car
                vm.search_active = false;
            }
        })
    }
    
    function isOdd(num) {
        return num % 2;
    }
    
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
                        API_Data.car_getall().then(function(result){
                            var car_list = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                            vm.car_list_all = car_list;
                            vm.cars = {data : vm.groups};
                            for(var i = 0; i < vm.cars.data.length; i++){
                                if(typeof vm.cars.data[i].cars !== 'undefined'){
                                    vm.group.push(vm.cars.data[i])
                                }
                            }
                            vm.loaded = true; 
                        })
                           
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }   
    
    angular.element(document).ready(function () {
        $http.get('/api/fuel_managements')
        .success(function(result){
            vm.fuel_manage = result.response
        })
        checkFlag();
    });
}