angular
    .module('app')
    .controller('SettingsController', SettingsController);

SettingsController.$inject = [];

function SettingsController(){ 
    var vm = this;
    angular.element(document).ready(function () {
        $(".dropdown-button").dropdown();
    });
}

angular.element(document).ready(function () {
    $('.modal-trigger').leanModal();
});