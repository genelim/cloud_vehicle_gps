angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope'];

function runBlock($rootScope){ 
    $rootScope.user = null; 
}