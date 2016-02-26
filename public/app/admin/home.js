angular
    .module('app')
    .controller('AdminController', AdminController);

AdminController.$inject = ['$rootScope', '$state'];

function AdminController($rootScope, $state){     
    if(!$rootScope.user){
        $state.go('home');
    }else if($rootScope.user.response.role.indexOf(1) !== 0){
        $state.go('dashboard');
    }
}