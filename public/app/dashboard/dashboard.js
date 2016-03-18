angular
    .module('app')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$rootScope', '$state', '$scope'];

function DashboardController($rootScope, $state, $scope){ 
    if(!$rootScope.user){
        $state.go('home');
    }
    angular.element(document).ready(function () {
        $('.tooltipped').tooltip({delay: 50});
        $('.dropdown-button').dropdown();
    });   
    $scope.$on('$viewContentLoaded', function(){
        $('ul.tabs').tabs();
        $('.dropdown-button').dropdown();
    });
    $('li').click(function(){
        $( this).siblings().css( "background-color", "transparent" );
        $( this).css( "background-color", "#EE6E73" );
    })
}