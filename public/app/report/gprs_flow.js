angular
    .module('app')
    .controller('GprsFlowController', GprsFlowController);

GprsFlowController.$inject = [];

function GprsFlowController(){ 
    var vm = this;
    vm.test = test;
    vm.date = null;
    function test(){
        console.log(vm.date)
    }
}