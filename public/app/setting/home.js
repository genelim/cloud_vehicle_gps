angular
    .module('app')
    .controller('SettingsController', SettingsController);

SettingsController.$inject = ['$rootScope'];

function SettingsController($rootScope){ 
    var vm = this;
    angular.element(document).ready(function () {
        $('.modal-trigger').leanModal();
        $(".dropdown-button").dropdown();
        $rootScope.admin_page = false;
    });
}