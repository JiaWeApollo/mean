define([
    'app'
], function(app) {
    'use strict';

    app.factory('AuthInterceptorService', function($q, $injector, $location, $rootScope, $http, Settings) {
        var serviceBase = Settings.apiServiceBaseUri;

        return {
            request: function(config) {
                config.headers = config.headers || {};
                var authData = localStorage.getItem('authorizationData');

                if (authData) {
                    authData = eval('(' + authData + ')');
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }
                config.headers["X-Requested-With"] = 'XMLHttpRequest';
                return config;
            },
            requestError: function(rejection) {
                return $q.reject(rejection);
            },
            response: function(response) {
                return response;
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    var authService = $injector.get('authService');
                    var authData = localStorage.getItem('authorizationData');

                    if (authData) {
                        authData = eval('(' + authData + ')');
                        if (authData.useRefreshTokens) {
                            $location.path('/refresh');
                            return $q.reject(rejection);
                        }
                    }
                    authService.logOut();
                    $location.path('/app/servers');
                }
                if (rejection.status === -1) {
                    $rootScope.openLoginModal();
                }
                return $q.reject(rejection);
            }
        }
    });
});
