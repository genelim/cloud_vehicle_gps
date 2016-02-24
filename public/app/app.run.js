angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope', 'Auth'];

function runBlock($rootScope, Auth){ 
    $rootScope.user = null; 
    Auth.then(function(data){
        if(data === '0'){
            $rootScope.user = null;
        }else{
            $rootScope.user = data;
        }
    })

}