/**
 * Created by tianxc on 16-8-2.
 */
define(['angular'], function(angular) {

    var commonService = angular.module('app.commonService', []);

    commonService.service('CommonService', ['$rootScope','$q', '$timeout', '$http','$state','Settings','$window','Upload','$loading','toastr','$filter', function($rootScope ,$q, $timeout, $http,$state,Settings,$window,Upload,$loading,toastr,$filter) {
            var serviceBase = Settings.apiServiceBaseUrl;

            function showToast(string, duration) {

            }
            return {
                showToast: function(string, duration) { //消息提示框
                    showToast(string,duration);
                },
                getAuthorizationData: function() { //获取用户信息
                    var authData = localStorage.getItem('LaborSignatureAuthorization');
                    if (authData != null) {
                        authData = eval('(' + authData + ')');
                    } else {
                        authData = null;
                    }
                    return authData;
                },
                getJsonData: function(url, par) { //获取JSON数据
                	//  if ($rootScope.token == '' ||$rootScope.token==undefined) {
                   //      var dataV={'data':{'token':''},'message':'','result':false};
                   //      var authData = localStorage.getItem('LaborSignatureAuthorization');
                   //      if(authData != undefined && authData != null)
                   //      {
                   //      	authData = eval('(' + authData + ')');
				    //         $rootScope.token = authData.token != "" ? authData.token : '';
                   //      }
                   // }
                    var deferred = $q.defer();
                    var num=Settings.version;
                    var dataJs = Settings.deBug === true ? '.json?v='+num: '';
                    $http({
                        url: serviceBase + url + dataJs,
                        method: (Settings.deBug === true ? "get" : "post"),
                        headers: {
                            'Authorization': 'Bearer ' + $rootScope.token,
                            'X-Requested-With':'XMLHttpRequest'
                        },
                        data: par,
                        timeout:100000
                    }).success(function(data) {
                        if (JSON.stringify(data).indexOf('login')>0 || (data.message!=undefined && data.message.indexOf('请求授权')>0)) {
                            localStorage.removeItem('LaborSignatureAuthorization');
                            $state.go('login');
                        }
                        else {
                            deferred.resolve(data);
                        }
                    }).error(function(error, status) {                    	
                        var msg = '获取数据出现错误!';
                        if(status == undefined){
                        	toastr.error('认证失效,请重新登录!');
                            localStorage.removeItem('LaborSignatureAuthorization');
					        $state.go('login');

                        }else if (status==0 || status == 500 || status==404){
                            msg = '服务器错误!';
                            toastr.error(msg);
                            deferred.reject(msg);
                        }else{
                            toastr.error(msg);
                            deferred.reject(msg);
                        }
                    });
                    return deferred.promise;
                },
                //上传文件
                uploadFile: function (url, file, par) {
                	var deferred = $q.defer();
	                Upload.upload({
	                    //服务端接收
	                    url: serviceBase + url,
	                    //上传的同时带的参数
	                    data: par,
	                    file: file
	                }).progress(function (evt) {
	                    //进度条
	                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                    $rootScope.progressPercentage=progressPercentage;
	                    console.log('progess:' + progressPercentage + '%' );
	                }).success(function (data, status, headers, config) {
	                    //上传成功
	                    deferred.resolve(data);
	                }).error(function (data, status, headers, config) {
	                    //上传失败
	                    console.log('error status: ' + status);
	                });
	                return deferred.promise;
	            },
                //本地存储数据
		        set:function(key,value){
		          $window.localStorage[key]=value;
		        },        //读取单个属性
		        get:function(key,defaultValue){
		          return  $window.localStorage[key] || defaultValue;
		        },        //存储对象，以JSON格式存储
		        setObject:function(key,value){
		          $window.localStorage[key]=JSON.stringify(value);
		        },        //读取对象
		        getObject: function (key) {
		          return JSON.parse($window.localStorage[key] || '{}');
		        },
		        getProvince:function(par,callback,callbackError){
                    this.getJsonData('api/common/getProvince',par).then(function(data) {
                       callback(data);
                    },function(error){
                        callbackError(error);
                    });
		        },
		        getCitys:function(par,callback,callbackError){
                    this.getJsonData('api/common/getCitys',par).then(function(data) {
                       callback(data);
                    },function(error){
                        callbackError(error);
                    });
		        },
		        getDictionaries:function(par,callback,callbackError){
                    this.getJsonData('api/home/dictionaries',par).then(function(data) {
                       callback(data);
                    },function(error){
                        callbackError(error);
                    });
		        }
                
            }
        }]);
    commonService.service('UtilService',['$window',function($window){
            return {
                isNull: function (val) {//检查给定的对象是否为Null或未定义
                    return val == null || val=='' || typeof(val) == "undefined";
                },
                isName:function(val){//姓名只能输入最小2个最大15个汉字字母组成
                    return !/^[a-zA-Z\u4e00-\u9fa5]{2,15}$/.test(val);
                },
                isNumber: function (val) {//判断给定的值是否是数字
                    return isNaN(val);
                },
                isInteger:function(val){//8位正整数
                    return !/^[1-9]{1}\d{0,7}$/.test(val);
                },
                isLength:function(val,minNum,maxNum){//判断字符串长度
                    return !(val.length>=minNum && val.length<maxNum)?true:false;
                },
                isEmpty: function (val) {//检查给定的字符串是否是空串或未定义
                    return this.trim(val).length == 0;
                },
                trim: function (val) {//移除给定的字符串两端的空白字符，如果字符串不存在则返回空串。
                    return !val ? "" : val.replace(/(^\s*)|(\s*$)/g, "");
                },
                isMobile:function(val){//检测手机号码格式号码是否正确
                    return !/^1[0-9]{10}$/.test(val);
                },
                isTelephone:function(val){//检测电话号码如0775-88888888
                    return !/^0\d{2,3}-\d{7,8}$/.test(val);
                },
                isEmail:function(val){//检测邮箱格式是否正确
                    return !/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(val);
                },
                isBankNo:function(val){//检测银行卡号格式是否正确
                    return !/^[0-9]{16,19}$/.test(val);
                },
                isArray: function (val) {//判断是否为数组
                    return !this.isNull(val) && Object.prototype.toString.call(val) === "[object Array]";
                },
                isStartWith: function (val, prefix) {//检查给定的字符串是否以某个字符串开头，如果要检测多个prefix，可指定prefix为数组。
                    if (!val) return false;
                    var arrays = this.isArray(prefix) ? prefix : [prefix];
                    for (var i = 0; i < arrays.length; i++) {
                        if (val.indexOf(arrays[i]) == 0) {
                            return true;
                        }
                    }
                    return false;
                },
                isContain: function (val, array) {//检查指定的值是否在给定的数组中。
                    if (!this.isArray(array)) return false;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] == val) return true;
                    }
                    return false;
                },
                isIdent:function(val){//验证身份证号格式是否正确
                    if(val.length==15)
                        return !/^\d{15}$/.test(val);
                    else
                        return !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/.test(val);
                },
                isSexByIdent:function(val){//根据身份证判断性别
                    if(val.length==15){
                        return (parseInt(val.toString().charAt(val.length-1))%2==0?'女':'男');
                    }else{
                        return parseInt(val.toString().charAt(val.length-2))%2==0?'女':'男';
                    }
                }
            }
        }])
        .service('dateService',['$window','$filter',function($window,$filter){
        	return {
        		parserDate:function (date) {  
			    var t = Date.parse(date);  
			    if (!isNaN(t)) {  
			        return new Date(Date.parse(date.replace(/-/g, "/")));  
			    } else {  
			        return;  
			    }  
	          },  
        	 formatDate:function (date) {  
				var t=$filter('date')(date,'yyyy-MM-dd hh:mm');
				return t;
	           }  
	         }
        }]);  
    return commonService;
});
