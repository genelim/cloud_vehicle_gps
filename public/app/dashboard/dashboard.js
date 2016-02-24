angular
    .module('app')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = [];

function DashboardController(){ 
    
    angular.element(document).ready(function () {
        $('.dropdown-button').dropdown();
        $('.tooltipped').tooltip({delay: 50});
    });   
}