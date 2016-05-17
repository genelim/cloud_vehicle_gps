angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope', 'Auth', 'API_Data', '$state', '$http'];

function runBlock($rootScope, Auth, API_Data, $state, $http){ 
    $rootScope.user = null; 
    $rootScope.user_type = 0;
    $rootScope.admin_page = false;
    $rootScope.user_check = 0;
    $rootScope.disturb_off = false;
    $rootScope.notification = [];
    $rootScope.live_noti = 0;
    var  groups = [];
    var  cars = [];
    var group = []
    var carid = []
    var fuel_manage = null;
    
    $http.get('/api/fuel_managements')
    .success(function(result){
         fuel_manage = result.response
    })
    Auth.then(function(data){
        if(data === false){
            $rootScope.user =false;
            $rootScope.user_check = 2;
        }else{
            $rootScope.user = data.data[0];
            $rootScope.user_check = 1
        }
    })
    
    var current_idle  = [];
    function checking_idle(){
        var time800 = new Date(2010, 12, 21, 8, 00, 0, 0).getTime();
        var time1700 = new Date(2010, 12, 21, 17, 00, 0, 0).getTime();
        if($rootScope.user_check === 1){
            var requests = 0;
            function check_idle(i) {
                if( i < carid.length ) {
                    requests++;
                    API_Data.gps_getpos(carid[i].carID).then(function(result){
                    //     requests--;
                        res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        // res.data[0].gpsTime = new Date(res.data[i].gpsTime)
                        res.data[0].gpsTime = new Date(res.data[0].gpsTime_str)
                        
                        if(isEmpty(current_idle[i])){
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                if(res.data[0].speed === 0){
                                    current_idle[i] = res.data[0]
                                }
                            }
                        }else{                            
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                if(res.data[0].speed === 0){
                                    var minute = res.data[0].gpsTime - current_idle[i].gpsTime;
                                    minute = Math.round(((minute % 86400000) % 3600000) / 60000)
                                    if(res.data[0].gpsTime.getTime() >= time800 && res.data[0].gpsTime.getTime() <= time1700){
                                        var set_minute = 30
                                    }else{
                                        var set_minute = 15                                        
                                    }
                                    if(minute > set_minute){
                                        //NOTIFY!
                                        current_idle[i] = res.data[0]
                                        var car_plate = null;
                                        for(var i = 0; i < group.length; i++){
                                            for(var a = 0; a < group[i].cars.length; a++){
                                                if(group[i].cars[a].carID === res.data[0].carID){
                                                    car_plate = group[i].cars[a].carNO
                                                }
                                            }
                                        }
                                        $rootScope.notification.push({type : 'idle', plate_number : car_plate, time : Date.now(), color: '#5e5e5f', carid: res.data[0].carID})
                                        $rootScope.live_noti += 1;
                                    }
                                }
                            }
                        }
                        if (requests == 0) more_car_details();
                    });
                    check_idle(i+1)
                }
            }    
            check_idle(0)
        }
    }
    
    var breaking  = [];
    function checking_harsh_breaking(){
        if($rootScope.user_check === 1){
            var requests = 0;
            function check_harsh_breaking(i) {
                if( i < carid.length ) {
                    requests++;
                    API_Data.gps_getpos(carid[i].carID).then(function(result){
                    //     requests--;
                        res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        res.data[0].gpsTime = new Date(res.data[0].gpsTime_str)
                        
                        if(isEmpty(breaking[i])){
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                breaking[i] = res.data[0]
                            }
                        }else{                         
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                difspeed = res.data[0].speed - breaking[i].speed
                                var minute = res.data[0].gpsTime - breaking[i].gpsTime;
                                minute = Math.round(((minute % 86400000) % 3600000) / 60000)
                                if(minute > 1){
                                    if(difspeed > 60){
                                        breaking[i] = res.data[0]
                                        var car_plate = null;
                                        for(var i = 0; i < group.length; i++){
                                            for(var a = 0; a < group[i].cars.length; a++){
                                                if(group[i].cars[a].carID === res.data[0].carID){
                                                    car_plate = group[i].cars[a].carNO
                                                }
                                            }
                                        }
                                        $rootScope.notification.push({type : 'harsh_breaking', plate_number : car_plate, time : Date.now(), color: '#E71D36', carid: res.data[0].carID})
                                        $rootScope.live_noti += 1;
                                    }
                                }
                            }
                        }
                        if (requests == 0) more_car_details();
                    });
                    check_harsh_breaking(i+1)
                }
            }    
            check_harsh_breaking(0)
        }
    }
    
    var fuel_check  = [];
    function checking_fuel(){
        if($rootScope.user_check === 1){
            var requests = 0;
            function check_fuel(i) {
                if( i < carid.length ) {
                    requests++;
                    API_Data.gps_getpos(carid[i].carID).then(function(result){
                        res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        res.data[0].gpsTime = new Date(res.data[0].gpsTime_str)
                        if(fuel_manage){
                            for(var l = 0; l < fuel_manage.length; l++){
                                if(fuel_manage[l].carID.toString() === res.data[0].carID.toString()){
                                     res.data[0].fuel_cal = fuel_manage[l].tank_volume/fuel_manage[l].max_resistance
                                }
                            }
                        }  
                        if(isEmpty(fuel_check[i])){
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                fuel_check[i] = res.data[0]
                            }
                        }else{                         
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                diffuel = res.data[0].fuel*res.data[0].fuel_cal - fuel_check[i].fuel*res.data[0].fuel_cal
                                console.log(diffuel)
                                var minute = res.data[0].gpsTime - fuel_check[i].gpsTime;
                                minute = Math.round(((minute % 86400000) % 3600000) / 60000)
                                if(minute > 1){
                                    if(diffuel > 100){
                                        fuel_check[i] = res.data[0]
                                        var car_plate = null;
                                        for(var i = 0; i < group.length; i++){
                                            for(var a = 0; a < group[i].cars.length; a++){
                                                if(group[i].cars[a].carID === res.data[0].carID){
                                                    car_plate = group[i].cars[a].carNO
                                                }
                                            }
                                        }
                                        $rootScope.notification.push({type : 'fuel', plate_number : car_plate, time : Date.now(), color: '#285943', carid: res.data[0].carID})
                                        $rootScope.live_noti += 1;
                                    }
                                }
                            }
                        }
                        if (requests == 0) more_car_details();
                    });
                    check_fuel(i+1)
                }
            }    
            check_fuel(0)
        }
    }
    var current_speed  = [];
    function checking_speed(){
        if($rootScope.user_check === 1){
            function check_speed(i) {
                if( i < carid.length ) {
                    API_Data.gps_getpos(carid[i].carID).then(function(result){
                        res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        res.data[0].gpsTime = new Date(res.data[0].gpsTime_str)
                        
                        if(isEmpty(current_speed[i])){
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                if(res.data[0].speed !== 0){
                                    current_speed[i] = res.data[0]
                                }
                            }
                        }else{                            
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                if(res.data[0].speed !== 0){
                                    if(res.data[0].speed > 100){
                                        if(typeof current_speed[i].speedy !== 'undefined'){
                                            if(res.data[0].speed - current_speed[i].speedy > 10){
                                                current_speed[i] = res.data[0]
                                                current_speed[i].speedy = current_speed[i].speed;
                                                var car_plate = null;
                                                for(var i = 0; i < group.length; i++){
                                                    for(var a = 0; a < group[i].cars.length; a++){
                                                        if(group[i].cars[a].carID === res.data[0].carID){
                                                            car_plate = group[i].cars[a].carNO
                                                        }
                                                    }
                                                }
                                                $rootScope.notification.push({type : 'speed', plate_number : car_plate, time : Date.now(), color: '#E71D36', carid: res.data[0].carID})
                                                $rootScope.live_noti += 1;
                                            }
                                        }else{
                                            current_speed[i] = res.data[0]
                                            current_speed[i].speedy = current_speed[i].speed;
                                            var car_plate = null;
                                            for(var i = 0; i < group.length; i++){
                                                for(var a = 0; a < group[i].cars.length; a++){
                                                    if(group[i].cars[a].carID === res.data[0].carID){
                                                        car_plate = group[i].cars[a].carNO
                                                    }
                                                }
                                            }
                                            $rootScope.notification.push({type : 'speed', plate_number : car_plate, time : Date.now(), color: '#E71D36', carid: res.data[0].carID})
                                            $rootScope.live_noti += 1;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    check_speed(i+1)
                }
            }    
            check_speed(0)
        }
    }
    
    var fatigue_check  = [];
    function checking_fatigue(){
        if($rootScope.user_check === 1){
            function check_fatigue(i) {
                if( i < carid.length ) {
                    API_Data.gps_getpos(carid[i].carID).then(function(result){
                        res = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                        res.data[0].gpsTime = new Date(res.data[0].gpsTime_str)                        
                        if(isEmpty(fatigue_check[i])){
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                fatigue_check[i] = res.data[0]
                                fatigue_check[i].fatigue = 0;
                            }
                        }else{                      
                            if(res.data[0].status.indexOf("ACC off") < 0 && res.data[0].status !== null){
                                difspeed = res.data[0].speed - fuel_check[i].speed                          
                                var minute = res.data[0].gpsTime - fatigue_check[i].gpsTime;
                                minute = Math.round(((minute % 86400000) % 3600000) / 60000)
                                if(minute > 3){
                                    if(difspeed > 30 || difspeed < -30){
                                        var tt = fatigue_check[i].fatigue;
                                        if(tt > 1){
                                            fatigue_check[i] = res.data[0];
                                            fatigue_check[i].fatigue = 0
                                            var car_plate = null;
                                            for(var i = 0; i < group.length; i++){
                                                for(var a = 0; a < group[i].cars.length; a++){
                                                    if(group[i].cars[a].carID === res.data[0].carID){
                                                        car_plate = group[i].cars[a].carNO
                                                    }
                                                }
                                            }                                    
                                            $rootScope.notification.push({type : 'fatigue', plate_number : car_plate, time : Date.now(), color: '#fcbe32 ', carid: res.data[0].carID})
                                            $rootScope.live_noti += 1;
                                        }else{
                                            fatigue_check[i] = res.data[0];
                                            fatigue_check[i].fatigue = tt + 1                                                                              
                                        }                                      
                                    }else{
                                        fatigue_check[i] = res.data[0];
                                        fatigue_check[i].fatigue = 0;
                                    }
                                }
                            }
                        }
                    });
                    check_fatigue(i+1)
                }
            }    
            check_fatigue(0)
        }
    }
    
    function timing_inteval(){
        setInterval(function(){ 
            if($rootScope.disturb_off){
                $rootScope.notification = []
                $rootScope.live_noti = 0
            }else{
                checking_harsh_breaking()
                checking_idle() 
                checking_fuel()
                checking_speed()
                checking_fatigue()
            }
        }, 30000); 
    }
    
    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }
    
    checkFlag();
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
                        groups = [];
                        looping_group(result.data)
                        function looping_group(data){
                            for(var i = 0; i < data.length; i++){
                                groups.push({group : data[i].title, id : data[i].id})
                                if(data[i].children.length){
                                    looping_group(data[i].children)
                                }
                            }
                        }
                        
                        car_list(0);                           
                    }
                    
                    function car_list(i) {
                        if( i < groups.length ) {
                            requestsss++;
                            API_Data.cars_list(groups[i].id).then(function(result){
                                requestsss--;
                                var _car = JSON.parse(result.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                                if(_car.totalProperty > 0){                                    
                                    for(var a = 0; a < groups.length; a++){
                                        if(groups[i].id === groups[a].id){
                                            groups[i].cars = _car.rows
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
                            cars = {data : groups};
                            for(var i = 0; i < cars.data.length; i++){
                                if(typeof cars.data[i].cars !== 'undefined'){
                                    group.push(cars.data[i])
                                }
                            }
                            for(var i = 0; i < group.length; i++){
                                for(var a = 0; a < group[i].cars.length; a++){
                                    carid.push(group[i].cars[a])
                                }
                            }
                            for(var a = 0; a < carid.length; a++){
                                current_idle.push({})
                                breaking.push({})
                                fuel_check.push({})
                                current_speed.push({})
                                fatigue_check.push({})
                            }
                            timing_inteval()
                        })
                           
                    }                  
                })
            }else{
                Materialize.toast('Not able to retrieve data. Refresh page to try again', 2000);            
            } 
        }
    }   
}