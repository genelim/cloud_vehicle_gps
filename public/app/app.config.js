angular
    .module('app')
    .config(config);

config.$inject = ['$urlRouterProvider','$stateProvider','$locationProvider'];

function config($urlRouterProvider,$stateProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/dashboard', '/dashboard/home');
    $urlRouterProvider.when('/dashboard/', '/dashboard/home');

    $stateProvider
    .state('home', {
        url:'/',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
    })
    .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
    })
    .state('dashboard.home', {
        url:'/home',
        templateUrl: 'app/dashboard/home.html',
    })
    .state('dashboard.vehicle_tracking', {
        url:'/vehicle_tracking',
        templateUrl: 'app/dashboard/vehicle_tracking.html',
    })
    .state('dashboard.settings', {
        url:'/settings',
        templateUrl: 'app/setting/home.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
    })
    .state('dashboard.settings.message_to_device', {
        url:'/message_to_device',
        templateUrl: "app/setting/message_to_device.html"
    })
    .state('dashboard.settings.peripheral_settings', {
        url:'/peripheral_settings',
        templateUrl: "app/setting/peripheral_settings.html"
    })
    .state('dashboard.settings.interval', {
        url:'/interval',
        templateUrl: "app/setting/interval.html"
        
    })
    .state('dashboard.settings.timezone', {
        url:'/timezone',
        templateUrl: "app/setting/timezone.html"
        
    })
    .state('dashboard.settings.speed_threshold', {
        url:'/speed_threshold',
        templateUrl: "app/setting/speed_threshold.html"
        
    })
    .state('dashboard.settings.parking', {
        url:'/parking',
        templateUrl: "app/setting/parking.html"
        
    })
    .state('dashboard.settings.idle', {
        url:'/idle',
        templateUrl: "app/setting/idle.html"
        
    })
    .state('dashboard.settings.temperature', {
        url:'/temperature',
        templateUrl: "app/setting/temperature.html"
        
    })
    .state('dashboard.settings.yaw_setting', {
        url:'/yaw_setting',
        templateUrl: "app/setting/yaw_setting.html"
        
    })
    .state('dashboard.settings.yaw_management', {
        url:'/yaw_management',
        templateUrl: "app/setting/yaw_management.html"
    })
    .state('dashboard.settings.fatugue_driving_time', {
        url:'/fatugue_driving_time',
        templateUrl: "app/setting/fatugue_driving_time.html"
    })
    .state('dashboard.settings.autophotograph', {
        url:'/autophotograph',
        templateUrl: "app/setting/autophotograph.html"
    })
    .state('dashboard.settings.sms_altering', {
        url:'/sms_altering',
        templateUrl: "app/setting/sms_altering.html"
    })
    .state('dashboard.settings.sms_service_number', {
        url:'/sms_service_number',
        templateUrl: "app/setting/sms_service_number.html"
    })
    .state('dashboard.settings.geo_fence', {
        url:'/geo_fence',
        templateUrl: "app/setting/geo_fence.html"
    })
    .state('dashboard.settings.bay_information', {
        url:'/bay_information',
        templateUrl: "app/setting/bay_information.html"
    })







    .state('dashboard.reports', {
        url:'/reports',
        templateUrl: 'app/report/home.html',
    })

    $locationProvider.html5Mode({
        enabled: true
    });
}
