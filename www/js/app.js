// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('upload',{
    url:'/upload',
    templateUrl:"templates/upload.html",
    controller: "clickController"
 })
            .state('download', {
      url: '/download',
      templateUrl: 'templates/download.html',
      controller:'imageController'
    })
  $urlRouterProvider.otherwise('/upload');
});

app.controller('imageController', function($scope,  $timeout, $cordovaFileTransfer) {  
  $scope.addImage = function () {
    var url=[];
    firebase.database().ref('images/').once('value').then(function(snapshot){
      $scope.$apply(function(){
        $scope.downloadLinks = snapshot.val();
        for (j in $scope.downloadLinks) {
        url.push($scope.downloadLinks[j].link);
        console.log(url);
      }

      console.log(url);
      $scope.src = [];
      for(var i=0; i<url.length; i++) {
        var targetPath = cordova.file.externalRootDirectory + url[i].split('/')[url[i].split('/').length - 1];
        $scope.tp = targetPath;
        var trustHosts = true;
        var options = {};
        $cordovaFileTransfer.download(url[i], targetPath, options, trustHosts)
        .then(function(result) {
          // Success!
          $scope.src.push(result.nativeURL);
          $scope.status = JSON.stringify(result.nativeURL);
          alert($scope.src);
          // var image = document.getElementById('myImage');
          // image.src = $scope.src ;
        }, function(err) {
            // Error
            $scope.status = JSON.stringify(err);
            alert($scope.status);
        }, function (progress) {
            $timeout(function () {
              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
            });
        });
      }
      });
    });  
  }
});

app.controller('clickController', function($scope, $state, AddImage) {
  $scope.download = function() {
    $state.go('download');
  }
  // 1
  $scope.images = [];
  $scope.addImage = function() {
    AddImage.uploadImage('myImage');
  };
});

