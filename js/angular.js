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
            controller: 'splashCtrl',
            controllerAs: 'sc'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'page/login.html',
            controller: 'loginCtrl'
        })
        .state('writeEntry', {
            url: '/writeEntry',
            templateUrl: 'page/createPost.html',
            controller: 'writeBlog',
            controllerAs: 'wb'
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
            .then(function(response){

                headScope.logged = true;
                $scope.$digest();
            }, function(error){
                console.log("THE " + error);
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

.controller("splashCtrl", function(cloudServe, $scope){
    var splashScope = this;
    this.posts = {};
    this.allPosts = function(){
        cloudServe.getBlogs()
            .then(function(response){
                console.log(response.val());
                splashScope.posts = response.val();
                $scope.$digest();
            });
    }
})

.controller("writeBlog", function(cloudServe){
    this.postToBlog = function(title, post){
        cloudServe.createPost(title, post)
            .then(function(){
                console.log("write success")
            }, function(){
                console.log("a fail");
            })
    }
});

