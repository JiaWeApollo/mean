/**
 * Created by tianxc on 16-8-3.
 */
define([
    'app'
], function(app) {
    'use strict';

    app.factory('homeService', function($http,CommonService) {
        return {
            getAllPerson: function(par,callback,errorCallBack) { //get all peron
                CommonService.getJsonData('api/getAllPerson', par).then(function(data) {
                    callback(data);
                },function (error) {
                    errorCallBack(error);
                });
            },
            editPerson: function(par,callback,errorCallBack) { // add perosn
                CommonService.getJsonData('api/editPerson', par).then(function(data) {
                    callback(data);
                },function (error) {
                    errorCallBack(error);
                });
            },
            deletePerson: function(par,callback,errorCallBack) { // delete perosn
                CommonService.getJsonData('api/deletePerson', par).then(function(data) {
                    callback(data);
                },function (error) {
                    errorCallBack(error);
                });
            }
        }
    });
});