angular
    .module('app')
    .controller('ResetPasswordController', ResetPasswordController);

ResetPasswordController.$inject = ['$http', '$stateParams', '$rootScope'];

function ResetPasswordController($http, $stateParams, $rootScope){ 
    var vm = this;
  
    angular.element(document).ready(function(){
        $rootScope.user_type = 1;
        console.log($stateParams)
    })
}