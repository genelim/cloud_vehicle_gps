angular
    .module('app')
    .controller('AdminVehiclesController', AdminVehiclesController);

AdminVehiclesController.$inject = ['$http', 'API_Data', '$rootScope'];

function AdminVehiclesController($http, API_Data, $rootScope){ 
    var vm = this;
}