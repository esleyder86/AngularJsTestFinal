
var app = angular.module('myApp', ['ngRoute',"LocalStorageModule"]);

app.factory('UserInfoService',function(localStorageService){
  var userInfo = {};
  userInfo.key = "user";
  if(localStorageService.get(userInfo.key)){
    userInfo.users = localStorageService.get(userInfo.key)
  }else{
    userInfo.users = [];
  }

  userInfo.add = function(newUser){
    userInfo.users.push(newUser);
    userInfo.updateLocalStorage();
  }
  userInfo.updateLocalStorage = function(newUser){
    localStorageService.set(userInfo.key, userInfo.users);
  }

  userInfo.clean = function(){
    userInfo.users = [];
    userInfo.updateLocalStorage();
  }
  userInfo.getAll = function(){
    return userInfo.users;
  }

  userInfo.removeUser = function(item){
    userInfo.users = userInfo.users.filter(function(user){
      return user !== item;
    })
  }


  return userInfo;
})

app.config(function ($routeProvider) {
  $routeProvider.when("/formulario", {
    templateUrl: "form/form.html",
    controller: 'FormController'
  })
  .otherwise({
    redirectTo: "/",
    
  });
})


app.controller('AppController', function ($scope) {
  $scope.user = "Bienvenido"

});

app.controller('FormController', function ($scope,UserInfoService,$http) {
  $scope.likes =  [{ name: "El espacio sideral", id: 1 }, { name: "Ir a Misa", id: 2 }];
  $scope.user = [];
  $scope.users = {};
  $scope.likesApi = {};
  $scope.likesChoosed = [];


  $scope.addUserInfo = function(){
    $scope.users = UserInfoService.add($scope.user);

    $scope.users = UserInfoService.getAll();
    console.log($scope.user);
  }

  $scope.getLikesChecked = function(like) {
    $scope.likesChoosed.push(like);
    console.log($scope.likesChoosed)
  }
  
  $scope.clean = function(){
    $scope.users = UserInfoService.clean();
  }

  $scope.changeLikes = function() {
    if($scope.user.item.id == 1){
      $http({
        method: 'GET',
        url: 'http://www.asterank.com/api/mpc?&limit=6'
      }).then(function successCallback(response) {
        $scope.likesApi = response.data
        console.log($scope.likesApi)
        }, function errorCallback(response) {

        });
    }
    else if($scope.user.item.id == 2){
      $http({
        method: 'GET',
        url: 'http://calapi.inadiutorium.cz/api/v0/en/calendars/general-en/tomorrow'
      }).then(function successCallback(response) {
        
        $scope.likesApi = response.data.celebrations
        }, function errorCallback(response) {

        });
    }
  }

});

