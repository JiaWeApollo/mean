/**
 * Created by tianxc on 16-8-3.
 */
define([
    'app'
], function(app) {
    'use strict';

    app.factory('AccountService', function($http,CommonService) {
        return {
            login: function(par,callback) { //登录
                CommonService.getJsonData('api/home/login', par).then(function(data) {
                    callback(data);
                });
            },
            updatePassword: function(par,callback) { //修改密码
                CommonService.getJsonData('api/home/updatePassword', par).then(function(data) {
                    callback(data);
                });
            },
            findPassword: function(par,callback) { //忘记密码
                CommonService.getJsonData('api/home/findPassword', par).then(function(data) {
                    callback(data);
                });
            },
            verifyCode: function(par,callback) { //获取手机验证码
                CommonService.getJsonData('api/home/verifyCode', par).then(function(data) {
                    callback(data);
                });
            }
        }
    });
});