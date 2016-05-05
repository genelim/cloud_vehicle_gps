angular
    .module('app')
    .controller('AdminGroupsController', AdminGroupsController);

AdminGroupsController.$inject = ['$http', 'API_Data', '$rootScope'];

function AdminGroupsController($http, API_Data, $rootScope){ 
    var vm = this;
}