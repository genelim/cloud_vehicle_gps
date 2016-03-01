angular
    .module('app')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$rootScope', '$state', '$scope'];

function DashboardController($rootScope, $state, $scope){ 
    if(!$rootScope.user){
        $state.go('home');
    }
    angular.element(document).ready(function () {
        $('.dropdown-button').dropdown();
        $('.modal-trigger').leanModal();
        $('.tooltipped').tooltip({delay: 50});
    });   
    $scope.$on('$viewContentLoaded', function(){
        $('ul.tabs').tabs();
    });
}