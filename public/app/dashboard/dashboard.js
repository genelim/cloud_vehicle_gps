angular
    .module('app')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$rootScope', '$state'];

function DashboardController($rootScope, $state){ 
    if(!$rootScope.user){
        $state.go('home');
    }
    angular.element(document).ready(function () {
        $('.dropdown-button').dropdown();
        $('.tooltipped').tooltip({delay: 50});
    });   
}