angular
    .module('app')
    .controller('FuelConsumptionController', FuelConsumptionController);

FuelConsumptionController.$inject = ['$rootScope', 'API_Data', '$scope', '$timeout'];

function FuelConsumptionController($rootScope, API_Data, $scope, $timeout){ 
    var vm = this;
    vm.loaded = false;
    vm.search_active = false;
    vm.date = null;
    vm.plate_number = null;
    vm.carid = null;
    vm.get_fuel = get_fuel;
    vm.fuel_data_full = [];
    vm.cars = null
    vm.data = [];
    vm.labels = [];
    vm.series = ['Speed', 'Fuel'];
    vm.group = []
    vm.group_update = group_update
    vm.plate_number_select = plate_number_select
    
    angular.element(document).ready(function () {
        vm.loaded = false;
        checkFlag();
    });
        
    function get_fuel(){
        vm.fuel_data_full = [];
        vm.search_active = true;
        vm.carid = null;
        if(vm.group_selected){
            if(vm.plate_number){
                for(var i = 0; i < vm.group_selected.cars.length; i++){
                        if(vm.plate_number.carNO === vm.group_selected.cars[i].carNO){
                            vm.carid = vm.group_selected.cars[i].carID;
                        }               
                }
            }else{
                Materialize.toast('Please enter valid Plate Number', 2000);
            }  
        }else if(!vm.plate_number){
            if(vm.caridz){
                vm.carid = vm.caridz;                
            }else{
                vm.carid = null;
            }
        }else if(!vm.carid){
            //type ownself so need to get the id manually
            for(var i = 0; i < vm.cars.data.length; i++){
                if(typeof vm.cars.data[i].cars !== 'undefined'){
                    for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                        if(vm.cars.data[i].cars[a].carNO === vm.plate_number.carNO){
                            vm.carid = vm.cars.data[i].cars[a].carID
                        }
                    }
                }
            }
        }else if(vm.plate_number){
            for(var i = 0; i < vm.cars.data.length; i++){
                if(typeof vm.cars.data[i].cars !== 'undefined'){
                    for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                        if(vm.cars.data[i].cars[a].carNO === vm.plate_number.carNO){
                            vm.carid = vm.cars.data[i].cars[a].carID
                        }
                    }
                }
            }
        }
        
        vm.data = [];
        vm.labels = [];       
        API_Data.gps_gethistorypos(vm.date, vm.carid)
        .then(function(result){
            var res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            if(res.data.length){
                for(var i = 0; i < res.data.length; i++){
                    res.data[i].gpsTime = new Date(res.data[i].gpsTime)
                }
                vm.data[0] = [];
                vm.data[1] = [];
                var base_fuel = 0;
                var fuel_consumption = 0;
                
                for(var i = 0; i < res.data.length; i++){
                    // var hours = res.data[i].gpsTime.getHours()
                    // var minutes = res.data[i].gpsTime.getMinutes()
                    // var seconds = res.data[i].gpsTime.getSeconds()
                    // vm.labels.push(hours + ' ' + minutes + ':' +seconds)
                    vm.labels.push(res.data[i].gpsTime)
                    vm.data[0].push(res.data[i].speed)
                    vm.data[1].push(res.data[i].fuel)
                    if(i === 0){
                        base_fuel = res.data[i].fuel;
                    }else{
                        if(base_fuel !== res.data[i].fuel){
                            if(base_fuel > res.data[i].fuel){
                                console.log(base_fuel, res.data[i].fuel)
                                console.log(base_fuel - res.data[i].fuel)
                                fuel_consumption += base_fuel - res.data[i].fuel
                                base_fuel = res.data[i].fuel;
                            }
                        }
                    }
                }
                var chartData = generateChartData();
                var chart = AmCharts.makeChart("chartdiv", {
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 80,
                    "dataProvider": chartData,
                    "valueAxes": [{
                        "position": "left",
                        "title": "Fuel"
                    }],
                    "mouseWheelZoomEnabled": true,
                    "graphs": [{
                        "id": "g1",
                        "fillAlphas": 0.4,
                        "valueField": "visits",
                        "balloonText": "<div style='margin:5px; font-size:19px;'>Fuel:<b>[[value]]</b></div>"
                    }],
                    "chartScrollbar": {
                        "graph": "g1",
                        "scrollbarHeight": 80,
                        "backgroundAlpha": 0,
                        "selectedBackgroundAlpha": 0.1,
                        "selectedBackgroundColor": "#888888",
                        "graphFillAlpha": 0,
                        "graphLineAlpha": 0.5,
                        "selectedGraphFillAlpha": 0,
                        "selectedGraphLineAlpha": 1,
                        "autoGridCount": true,
                        "color": "#AAAAAA"
                    },
                    "chartCursor": {
                        "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                        "cursorPosition": "mouse"
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "minPeriod": "mm",
                        "parseDates": true
                    },
                    "export": {
                        "enabled": true,
                        "dateFormat": "YYYY-MM-DD HH:NN:SS"
                    }
                });

                chart.addListener("rendered", zoomChart);
                zoomChart();

                // this method is called when chart is first inited as we listen for "rendered" event
                function zoomChart() {
                    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
                        chart.zoomToIndexes(chartData.length - 250, chartData.length - 100);
                }
                vm.fuel_data_full.plate_number = vm.plate_number;
                vm.fuel_data_full.fuel_consumption = fuel_consumption;
                vm.fuel_data_full.total_mileage = res.data[res.data.length - 1].mileage - res.data[0].mileage;
                vm.search_active = false; 
            }else{
                vm.search_active = false;
                for(var i = 0; i < vm.cars.data.length; i++){
                    if(typeof vm.cars.data[i].cars !== 'undefined'){
                        for(var a = 0; a < vm.cars.data[i].cars.length; a++){
                            if(vm.cars.data[i].cars[a].carID === vm.carid){
                                vm.fuel_data_full.data = []
                                vm.fuel_data_full.plate_number = vm.cars.data[i].cars[a].carNO
                            }
                        }
                    }
                }
            }            
        })
    }
    
    function generateChartData() {
        var chartData = [];
        var firstDate = new Date();
        firstDate.setDate(firstDate.getDate() - 5);
        console.log(vm.data)
        for (var i = 0; i < vm.data[1].length; i++) {
            console.log(vm.data[1][i])
            var newDate = new Date(vm.labels[i]);
            newDate.setMinutes(newDate.getMinutes());
            chartData.push({
                date:newDate,
                visits: vm.data[1][i]
            });
        }
        return chartData;
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
                            $timeout(function() {
                                $('.dropdown-button').dropdown();
                            }, 100);
                        })
                           
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }  
    
    function plate_number_select(data){
        vm.plate_number = angular.copy(data)
    }
    
    function group_update(){
        vm.plate_number = null;
        vm.car_id = vm.group_selected.cars
    }
}