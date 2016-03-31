/**
 * Created by Mad Martigan on 3/28/2016.
 */
angular.module('cloudBlog', ['ui.router', "firebase", "btford.markdown"])

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
                views: {

                    // the main template will be placed here (relatively named)
                    '': { templateUrl: 'page/createPost.html',
                        controller: 'writeBlog',
                        controllerAs: 'wb'
                    },

                    // the child views will be defined here (absolutely named)
                    'columnOne@writeEntry': { template: 'Look I am a column!' },

                    //// for column two, we'll define a separate controller
                    'columnTwo@writeEntry': {
                        template: 'table-data.html'
                                            }
                }
                //templateUrl: 'page/createPost.html',
                //controller: 'writeBlog',
                //controllerAs: 'wb'
            })
            .state('writeEntry.poke', {
                url: '/poke',
                template: 'I like poke'
            })
            .state('writeEntry.nopoke', {
                url: '/nopoke',
                template: 'I don\'t like poke'
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
    });


