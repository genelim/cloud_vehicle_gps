angular
    .module('app')
    .controller('IdleController', IdleController);

IdleController.$inject = ['$http'];

function IdleController($http){ 
    var vm = this;
    vm.get_idle = get_idle;
    vm.date = null;
    vm.plate_number = null;
    vm.idle = [];
    
   function get_idle(){
        vm.idle = [];
        var data = {date : vm.date, plate_number : vm.plate_number}
        $http.post('/api/gps_gethistorypos', data)
        .success(function(result){
            console.log(result)
            var res = JSON.parse(result.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            for(var i = 0; i < res.data.length; i++){
                res.data[i].gpsTime = new Date(res.data[i].gpsTime)
            }
            // console.log(res)
            var start = true;
            for(var i = 0; i < res.data.length; i++){
                if(res.data[i].speed === 0){
                    if(start == true){
                        vm.idle.push(res.data[i])   
                        start = false;
                    }
                }else{
                    if(start === false){
                        vm.idle.push(res.data[i])  
                        start = true;
                    }
                }
            }
            for(var i = 0; i < vm.idle.length; i++){
                if(isOdd(i)){
                   vm.idle[i-1].end_date = vm.idle[i].gpsTime
                   vm.idle[i-1].total_hours =  Math.abs(vm.idle[i].gpsTime - vm.idle[i-1].gpsTime) / 36e5;
                }
                if(i === (vm.idle.length - 1)){
                    if(!isOdd(i)){
                        vm.idle[i].end_date = new Date()
                        vm.idle[i].total_hours =  Math.abs(vm.idle[i].end_date - vm.idle[i].gpsTime) / 36e5;
                    }
                }
            }            
        })
    }
    function isOdd(num) {
        return num % 2;
    }
}