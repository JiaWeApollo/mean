define(['app'], function(app) {
	app.controller('appCtrl', ['$rootScope', '$scope', '$uibModal', '$loading','$state', 'homeService', 'CommonService','AccountService','$localStorage', '$window',
	function($rootScope, $scope, $uibModal,$loading, $state, homeService, CommonService, AccountService,$localStorage,$window) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');		
      $scope.app = {
        name: '即有信审平台',
        version: '1.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // angular translate
//    $scope.lang = { isopen: false };
//    $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
//    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
//    $scope.setLang = function(langKey, $event) {
//      // set the current lang
//      $scope.selectLang = $scope.langs[langKey];
//      // You can change the language during runtime
//      $translate.use(langKey);
//      $scope.lang.isopen = !$scope.lang.isopen;
//    };
      
      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true); 

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
      
	}]);
    app.controller("homeCtrl",function ($rootScope, $scope, $uibModal,$loading, $state, homeService, CommonService,$localStorage,toastr) {
        $scope.getList=function () {
            console.time("getList");
            homeService.getAllPerson($scope.parm,function (data) {
                console.log("获取人员信息：",data);
                if(data.status==true){
                    $scope.personList=data.data;
                }else{
                    toastr.error("获取人员失败");
                }
            },function (error) {
                toastr.error(error);
            })
            console.timeEnd("getList");
        };
        $scope.getList();
        $rootScope.$on("getList",function () {
            $scope.getList();
        })
        $scope.editOrAdd=function(index){  // add or edit
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editOrAdd.html',
                controller:function($scope,$rootScope,item,$uibModalInstance,homeService,UtilService,toastr){
                    $scope.parm = angular.copy(item);
                    //保存
                    $scope.save = function(){
                        console.log($scope.parm);
                        homeService.editPerson($scope.parm,function(data){
                            console.log(data);
                            if(data.status==true){
                                toastr.success(data.message);
                                $rootScope.$emit("getList", {});
                                $uibModalInstance.dismiss('cancel');
                            }else{
                                toastr.error(data.message);
                            }
                        },function(error){
                            toastr.error(error);
                        })
                    }
                    //取消
                    $scope.cancel =function(){
                        $uibModalInstance.dismiss('cancel');
                    }

                },
                resolve: {
                    item: function () {
                        if(index==-1){
                            return {name:"",sex:"",age:"",phone:"",address:""}
                        }else{
                            return $scope.personList[index];
                        }
                    }
                }
            });
        }
        $scope.delete=function (_id) {  // delete
            if(window.confirm('confirm to delete this item？')){
                homeService.deletePerson({"_id":_id},function(data){
                    console.log(data);
                    if(data.status==true){
                        toastr.success(data.message);
                        $scope.getList();  //刷新列表
                    }else{
                        toastr.error(data.message);
                    }
                },function(error){
                    toastr.error(error);
                })
            }
        }

    })
});