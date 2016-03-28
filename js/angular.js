/**
 * Created by Mad Martigan on 3/28/2016.
 */
angular.module('cloudBlog', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/landing');

    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: 'page/splash.html',
            controller: 'loginCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'page/login.html',
            controller: 'loginCtrl'
        })
})

.controller("headCtrl", function(cloudServe, $scope){
    var headScope = this;
    this.logged = cloudServe.loggedIn;
    this.userData = cloudServe.userData;

    this.test = function(param){
        console.log(param);
        console.log(this.userData);
    };

    this.logIn = function(email, password){
        cloudServe.logIn(email, password)
            .then(function(){
                headScope.logged = true;
                $scope.$digest();
            })
    };

    this.logOut = function(){

        cloudServe.logOut()
            .then(function(){
                headScope.logged = false;
                $scope.$digest();
            })
    }
})

.controller("loginCtrl", function(){

});