define([
    'angular',
    'angularAMD',
    'file-upload',
    'ngFile',
    'bindonce',
    'ui-bootstrap',
    'ngAnimate',
    'ngSanitize',
    'ui-router',
    'directive/directives',
    'directive/ui-nav',
    'directive/ui-toggleclass',
    'directive/ui-fullscreen',
    'filters/filters',
    'services/common/commonService',
    'services/ui/ui-load',
    'jquery',
    'ngStorage',
    'angular-loading',
    'spinjs',
    'angular-toastr',
    'dateTimePicker',
    'angular-zh-cn'
], function(angular, angularAMD) {
    'use strict';
    var serviceUrl = 'http://localhost:3000/';
    var picterServiceURL="http://10.10.11.95:9008/onLine/";

    var app = angular.module('app', [
         'ui.router', 'ui.bootstrap','ui.bootstrap.datetimepicker','ngAnimate', 'ngSanitize','ngFileUpload', 
         'app.directives','uiToggleClass','uiNav','uiload','uiFullscreen',
         'app.filters', 'app.commonService','darthwade.dwLoading','toastr',
         'ngStorage'
    ]);

    //全局常量
    app.constant('Settings', {
        apiServiceBaseUrl: serviceUrl,
        picterServiceURL:picterServiceURL,
        clientId: 'LaborSignaturePC',
        version: '1.0.0',
        deBug: false
    });

    // 配置
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        
        //判断是否登录
        var authData = null;
        authData = localStorage.getItem('LaborSignatureAuthorization');
        if(authData != undefined && authData != null)
        {
            authData = eval('(' + authData + ')');
        }
        if (authData === null) {
            $urlRouterProvider.otherwise('/app');
        } else {
            $urlRouterProvider.otherwise('/app');
        }
        $stateProvider
            .state('app', angularAMD.route({
                url: '/app',
                templateUrl:  'tpl/app.html',
                resolve: {
		                loadController: ['$q', '$stateParams',
		                    function($q, $stateParams) {
		                        var homeCtrl = "app/controllers/app/appCtr.js";
		                        var homeService = "app/services/home/homeService.js";
		                        var accountService = "app/services/account/accountService.js";
		                        var deferred = $q.defer();
		                        require([homeCtrl, homeService, accountService], function() {
		                            deferred.resolve();
		                        });
		                        return deferred.promise;
		                    }
		                ]
		            },
		        controllerProvider: function($stateParams) {
		                return "appCtrl";
		            }
            }))
            .state('app.homePage', angularAMD.route({
                url: '/homePage',
                templateUrl:  'tpl/home/homePage.html',
                resolve: {
		                loadController: ['$q', '$stateParams',
		                    function($q, $stateParams) {
		                        var homeCtrl = "app/controllers/app/appCtr.js";
		                        var homeService = "app/services/home/homeService.js";
		                        var deferred = $q.defer();
		                        require([homeCtrl, homeService], function() {
		                            deferred.resolve();
		                        });
		                        return deferred.promise;
		                    }
		                ]
		            },
		        controllerProvider: function($stateParams) {
		                return "homeCtrl";
		            }
            }))

            .state('login', angularAMD.route({ //登录
		            url: '/login',
		            templateUrl: 'tpl/account/login.html',
		            resolve: {
		                loadController: ['$q', '$stateParams',
		                    function($q, $stateParams) {
		                        var accountCtrl = "app/controllers/account/accountCtr.js";
		                        var accountService = "app/services/account/accountService.js";
		
		                        var deferred = $q.defer();
		                        require([accountCtrl, accountService], function() {
		                            deferred.resolve();
		                        });
		                        return deferred.promise;
		                    }
		                ]
		            },
		            controllerProvider: function($stateParams) {
		                return "LoginCtrl";
		            }
		    }))
            
       
    
    }]);

    return angularAMD.bootstrap(app);
});
