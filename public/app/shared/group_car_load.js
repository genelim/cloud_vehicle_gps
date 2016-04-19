angular
	.module('app')
	.service('Group_Car_Load', Group_Car_Load);

Group_Car_Load.$inject = ['$rootScope', 'API_Data', '$q'];

function Group_Car_Load($rootScope, API_Data, $q) {
    return { getShop : function () {
        var deferred = $q.defer();
        var vm = this;
        vm.group = null;
        vm.cars = null;
        
        if($rootScope.user_check === 0 && !$rootScope.user) {
                        deferred.resolve('redo');
        } else if($rootScope.user_check === 1){
            if($rootScope.user){
                var requestsss = 0;                
                API_Data.groups_tree().then(function(result){
                    if(result.data.response === '{"success":false"info":"NOT LOGIN"}'){
                        $rootScope.user =false;
                        $rootScope.user_check = 2;
                        return 'home'
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
                        vm.cars = {data : vm.groups};
                        deferred.resolve({cars : vm.cars, groups : vm.groups});
                        // return {cars : vm.cars, groups : vm.groups};
                                
                    }                  
                })
            }else{
                return false      
            } 
        }
    }
    }
}

