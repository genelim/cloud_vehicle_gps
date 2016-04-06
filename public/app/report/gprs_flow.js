angular
    .module('app')
    .controller('GprsFlowController', GprsFlowController);

GprsFlowController.$inject = [];

function GprsFlowController(){ 
    var vm = this;
    vm.test = test;
    vm.date = null;
    function test(date){
        console.log(vm.date)
    }
     $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
}