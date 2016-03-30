/**
 * Created by Mad Martigan on 3/28/2016.
 */
angular.module('cloudBlog', ['ui.router', "firebase"])

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('landing');

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

    .directive("contenteditable", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {
                function read() {
                    ngModel.$setViewValue(element.html());
                }

                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || "");
                };
                element.on("blur", function (e) {
                    scope.$apply(read);
                });

                element.on('keypress', function (e) {
                    if (e.charCode == 13) {
                        e.preventDefault();
                        element.next().focus();
                    }
                });
            }
        };
    })


