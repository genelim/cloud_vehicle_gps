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
            console.log(data)
            if(data.response === 'Invalid email or password!' || data.response === 'Server Error')
            $rootScope.user = null;
            else
            $rootScope.user = data;
        }
    })

}