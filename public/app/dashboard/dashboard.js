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
        $('.dropdown-test').dropdown({
            inDuration: 300,
            outDuration: 225,
            hover: true, // Activate on hover
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'right' // Displays dropdown with edge aligned to the left of button
        });
    });   
    $scope.$on('$viewContentLoaded', function(){
        $('ul.tabs').tabs();
        $('.dropdown-button').dropdown();
        $('.dropdown-test').dropdown({
            inDuration: 300,
            outDuration: 225,
            hover: true, // Activate on hover
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'right' // Displays dropdown with edge aligned to the left of button
        });
    });
    $('li.menu').click(function(){
        $( this).siblings().css( "background-color", "transparent" );
        $( this).css( "background-color", "#EE6E73" );
    })
}