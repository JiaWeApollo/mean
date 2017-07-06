/**
 * Created by tianxc on 16-8-3.
 */
define([
    'app'
], function(app) {
    'use strict';

    app.factory('upLoadFileService', function($http,CommonService) {
        return {
            upLoadFile: function(par,file,callback) { //登录
                CommonService.uploadFile('api/common/UploadImg',file,  par).then(function(data) {
                    callback(data);
                });
            },
            upLoadFileZip: function(par,file,callback) { //登录
                CommonService.uploadFile('api/common/UploadZip',file,  par).then(function(data) {
                    callback(data);
                });
            }
        }
    });
});