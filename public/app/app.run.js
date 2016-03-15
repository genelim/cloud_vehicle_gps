angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope', 'Auth'];

function runBlock($rootScope, Auth){ 
    $rootScope.user = null; 
    $rootScope.user_type = 0;
    $rootScope.admin_page = false;
    Auth.then(function(data){
        if(data === '0'){
            $rootScope.user = null;
        }else{
            if(data.response === 'Invalid email or password!' || data.response === 'Server Error')
            $rootScope.user = null;
            else{
                $rootScope.user = data;
            }
        }
    })

}