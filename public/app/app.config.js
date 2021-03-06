    angular
    .module('app')
    .config(Configuration);

Configuration.$inject = ['$urlRouterProvider','$stateProvider','$locationProvider'];

function Configuration($urlRouterProvider,$stateProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/dashboard/home');
    $urlRouterProvider.when('/dashboard', '/dashboard/home/list');
    $urlRouterProvider.when('/dashboard/', '/dashboard/home/list');
    $urlRouterProvider.when('/dashboard/settings', '/dashboard/settings/message_to_device');
    $urlRouterProvider.when('/dashboard/settings/', '/dashboard/settings/message_to_device');
    $urlRouterProvider.when('/dashboard/reports', '/dashboard/reports/driving_records');
    $urlRouterProvider.when('/dashboard/reports/', '/dashboard/reports/driving_records');
    $urlRouterProvider.when('/admin', '/admin/refuel');
    $urlRouterProvider.when('/admin/', '/admin/refuel');

    $stateProvider
    .state('home', {
        url:'/',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
    })
    .state('reset_password', {
        url:'/reset_password/:token',
        templateUrl: 'app/home/reset_password.html',
        controller: 'ResetPasswordController',
        controllerAs: 'vm'
    })
    .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
    })
    .state('dashboard.home', {
        url:'/home',
        templateUrl: 'app/dashboard/home.html',
        controller: 'DashboardHomeController',
        controllerAs: 'vm'
    })
    .state('dashboard.home.list', {
        url:'/list',
        templateUrl: 'app/dashboard/list.html',
        controller: 'HomeListController',
        controllerAs: 'vm'
    })
    .state('dashboard.home.map', {
        url:'/map/:id',
        templateUrl: 'app/dashboard/map.html',
        controller: 'HomeMapController',
        controllerAs: 'vm'
    })
    .state('dashboard.vehicle_tracking', {
        url:'/vehicle_tracking',
        templateUrl: 'app/dashboard/vehicle_tracking.html',
        controller: 'DashboardVehicleTrackingController',
        controllerAs: 'vm'
    })    
    .state('dashboard.settings', {
        url:'/settings',
        templateUrl: 'app/setting/home.html',
        controller: 'SettingsController',
        controllerAs: 'vm'
    })
    .state('dashboard.toll', {
        url:'/toll',
        templateUrl: 'app/toll/toll.html',
        controller: 'TollController',
        controllerAs: 'vm'
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
        controller: 'ReportsController',
        controllerAs: 'vm',
    })
    .state('dashboard.reports.history_playback', {
        url:'/history_playback',
        templateUrl: "app/report/history_playback.html",
        controller: 'HistoryPlaybackController',
        controllerAs: 'vm',
    })
    // .state('dashboard.reports.gprs_flow', {
    //     url:'/gprs_flow',
    //     templateUrl: "app/report/gprs_flow.html",
    //     controller: "GprsFlowController",
    //     controllerAs: 'vm'
    // })
    // .state('dashboard.reports.operation_log', {
    //     url:'/operation_log',
    //     templateUrl: "app/report/operation_log.html"
    // })
    // .state('dashboard.reports.find_photo', {
    //     url:'/find_photo',
    //     templateUrl: "app/report/find_photo.html"
    // })
    // .state('dashboard.reports.alarm_records', {
    //     url:'/alarm_records',
    //     templateUrl: "app/report/alarm_records.html"
    // })
    // .state('dashboard.reports.alarm_frequency', {
    //     url:'/alarm_frequency',
    //     templateUrl: "app/report/alarm_frequency.html"
    // })
    .state('dashboard.reports.driving_records', {
        url:'/driving_records',
        templateUrl: "app/report/driving_records.html",
        controller: "DrivingRecordsController",
        controllerAs: 'vm'
    })
    .state('dashboard.reports.vehicle_mileage', {
        url:'/vehicle_mileage',
        templateUrl: "app/report/vehicle_mileage.html",
        controller: "VehicleMileageController",
        controllerAs: 'vm'
    })
    .state('dashboard.reports.fuel_consumption', {
        url:'/fuel_consumption',
        templateUrl: "app/report/fuel_consumption.html",
        controller: "FuelConsumptionController",
        controllerAs: 'vm'
    })
    // .state('dashboard.reports.parking', {
    //     url:'/parking',
    //     templateUrl: "app/report/parking.html"
    // })
    // .state('dashboard.reports.status', {
    //     url:'/status',
    //     templateUrl: "app/report/status.html"
    // })
    // .state('dashboard.reports.geo_fence_alarm', {
    //     url:'/geo_fence_alarm',
    //     templateUrl: "app/report/geo_fence_alarm.html"
    // })
    // .state('dashboard.reports.geo_fence_statistic', {
    //     url:'/geo_fence_statistic',
    //     templateUrl: "app/report/geo_fence_statistic.html"
    // })
    // .state('dashboard.reports.temperature_graph', {
    //     url:'/temperature_graph',
    //     templateUrl: "app/report/temperature_graph.html"
    // })
    // .state('dashboard.reports.temperature_report', {
    //     url:'/temperature_report',
    //     templateUrl: "app/report/temperature_report.html"
    // })
    // .state('dashboard.reports.trip_event', {
    //     url:'/trip_event',
    //     templateUrl: "app/report/trip_event.html"
    // })
    // .state('dashboard.reports.running_trip', {
    //     url:'/running_trip',
    //     templateUrl: "app/report/running_trip.html"
    // })
    // .state('dashboard.reports.rf_data', {
    //     url:'/rf_data',
    //     templateUrl: "app/report/rf_data.html"
    // })
    .state('dashboard.reports.idle', {
        url:'/idle',
        templateUrl: "app/report/idle.html",
        controller: 'IdleController',
        controllerAs: 'vm'
    })

    // .state('dashboard.reports.fuel_management', {
    //     url:'/fuel_management',
    //     templateUrl: "app/report/fuel_management.html"
    // })

    .state('dashboard.reports.variation', {
        url:'/variation',
        templateUrl: "app/report/variation.html",
        controller: 'VariationController',
        controllerAs: 'vm'
    })
    .state('dashboard.reports.all_vehicle_summary', {
        url:'/all_vehicle_summary',
        templateUrl: "app/report/all_vehicle_summary.html",
        controller: 'AllVehicleSummaryController',
        controllerAs: 'vm'
    })
    
    .state('admin', {
        url:'/admin',
        templateUrl: "app/admin/home.html",
        controller: 'AdminController',
        controllerAs: 'vm'
    })

    .state('admin.users', {
        url:'/users',
        templateUrl: "app/admin/users.html",
        controller: 'AdminUserController',
        controllerAs: 'vm'
    })
    .state('admin.location', {
        url:'/location',
        templateUrl: "app/admin/location.html",
        controller: 'AdminLocationController',
        controllerAs: 'vm'
    })
    .state('admin.refuel', {
        url:'/refuel',
        templateUrl: "app/admin/refuel.html",
        controller: 'AdminRefuelController',
        controllerAs: 'vm'
    })
    .state('admin.groups', {
        url:'/groups',
        templateUrl: "app/admin/groups.html",
        controller: 'AdminGroupsController',
        controllerAs: 'vm'
    })
    .state('admin.vehicles', {
        url:'/vehicles',
        templateUrl: "app/admin/vehicles.html",
        controller: 'AdminVehiclesController',
        controllerAs: 'vm'
    })

    $locationProvider.html5Mode({
        enabled: true
    });
}