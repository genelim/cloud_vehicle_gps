angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope', 'Auth'];

function runBlock($rootScope, Auth){ 
    $rootScope.user = null; 
    $rootScope.user_type = 0;
    $rootScope.admin_page = false;
    $rootScope.user_check = 0;
        Auth.then(function(data){
            if(data === false){
                $rootScope.user =false;
                $rootScope.user_check = 2;
            }else{
                $rootScope.user = data.data[0];
                $rootScope.user_check = 1
            }
        })
    

}