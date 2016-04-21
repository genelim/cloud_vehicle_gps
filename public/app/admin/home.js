angular
    .module('app')
    .controller('AdminController', AdminController);

AdminController.$inject = ['$rootScope', '$state', '$scope'];

function AdminController($rootScope, $state, $scope){     
    // if(!$rootScope.user){
    //     $state.go('home');
    // }else if($rootScope.user.response.role.indexOf(1) !== 0){
    //     $state.go('dashboard');
    // }
    if(!$rootScope.user){
        $state.go('home');
    }
    $rootScope.admin_page = true;
}