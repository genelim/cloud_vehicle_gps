angular
    .module('app')
    .controller('ReportsController', ReportsController);

ReportsController.$inject = ['$rootScope'];

function ReportsController($rootScope){ 
    var vm = this;
    angular.element(document).ready(function () {
        $(".dropdown-button").dropdown();
        $rootScope.admin_page = false;

    });
}