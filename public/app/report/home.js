angular
    .module('app')
    .controller('ReportsController', ReportsController);

ReportsController.$inject = [];

function ReportsController(){ 
    var vm = this;
    angular.element(document).ready(function () {
        $(".dropdown-button").dropdown();
    });
}