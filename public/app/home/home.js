angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$http', '$state', '$rootScope', 'Auth', 'API_Data'];

function HomeController($http, $state, $rootScope, Auth, API_Data){ 
    var vm = this;
    vm.login = login;
    vm.forget_password_modal = forget_password_modal;
    vm.forget_password = forget_password;
    vm.user = null;
    vm.load = false;
    angular.element(document).ready(function () {
        checkFlag();  
    });
    
    function checkFlag() {
        if($rootScope.user_check === 0) {
            window.setTimeout(checkFlag, 1000); /* this checks the flag every 1000 milliseconds*/
        } else if($rootScope.user_check === 1){
            if($rootScope.user){
                $rootScope.admin_page = false;
                $state.go('dashboard');
            } 
        }
    }
        
    function login(){
        // $http.post('/api/user_login', vm.user)
        // .success(function(user){
        //     if(user.response === 'Invalid email or password!' || user.response === 'Server Error'){
        //         Materialize.toast(user.response, 2000);
        //     }else{
        //         Materialize.toast('Welcome '+user.response.username, 2000);
        //         $rootScope.user = user;
        //         $state.go('dashboard');
        //         $('.dropdown-button').dropdown();
        //     }
        // })
        $http.post('/api/login', vm.user)
        .success(function(result){
            var result = JSON.parse(result.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
            API_Data.user_getinfo(result.data.userid).then(function(result2){
                var result2 = JSON.parse(result2.data.response.replace(/new UtcDate\(([0-9]+)\)/gi, "$1"));
                if(result2.data.length){
                    $rootScope.user = result2.data[0];
                    $state.go('dashboard');
                    $('.dropdown-button').dropdown();
                }else{
                    $rootScope.user = null;
                }
            })
        })
        
    }

    function forget_password_modal(){
         $('#resetpassword').openModal();
    }
    
    function forget_password(username){
        vm.load = true;
        if(username){
            $http.post('/api/reset_password', {username : username })
            .success(function(value){
                if(value.response === 'Message sent!'){
                    $('#resetpassword').closeModal();
                }
                Materialize.toast(value.response, 2000);
                vm.load = false;
            })
        }
    }
}