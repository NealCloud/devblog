/**
 * Created by Mad Martigan on 3/28/2016.
 * a dev blog angular app that uses ui router, firebase, and markdown
 */
angular.module('cloudBlog', ['ui.router', "firebase", "btford.markdown"])
/**
 * runs the app and sets the state and stateParams to global scope
 * so I can use the end of urls as parameters   /EiAd2d2_239D  - as a key to firebase
* */
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
/**
 * config for the ui routes
 * allows for multiple views inside a template and dynamic urls
* */
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/landing');

        $stateProvider
            //basic routing linking with # is no longer needed use ui-serf='landing'
            .state('landing', {
                url: '/landing',
                templateUrl: 'page/splash.html',
                controller: 'splashCtrl',
                controllerAs: 'sc'
            })
            .state('projects',{
                url: '/projects',
                templateUrl: 'page/projects.html',
                controller: 'projectsCtrl',
                controllerAs: 'pc'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'page/login.html',
                controller: 'loginCtrl'
            })
            //uses views to have multiple routes inside the template
            .state('writeEntry', {
                url: '/writeEntry',
                views: {
                    // the main template is blank
                    '': { templateUrl: 'page/createPost.html',
                        controller: 'writeBlog',
                        controllerAs: 'wb'
                    },
                    // the child views uses @ to seperate it from parent  html ex: ui-view="columnOne"
                    'columnOne@writeEntry': { template: 'Look I am a test column!' },

                    // another child view can also have controllers or templateUrl
                    'columnTwo@writeEntry': {
                        template: 'table-data.html'
                                            }
                }
            })
            //use the . to extend the view within it a . only one can lock on at a time html ex: ui-sref=".poke"
            .state('writeEntry.poke', {
                url: '/poke',
                template: 'I like poke'
            })
            .state('writeEntry.nopoke', {
                url: '/nopoke',
                template: 'I don\'t like poke'
            })
            .state('makeProject', {
                url: '/makeProject',
                templateUrl: 'page/createProject.html',
                controller: 'projectCtrl',
                controllerAs: 'pc'
            })
            /**
             * Project uses dynamic routes
             * creates a unique link in the project path with an ID key
             * key can be retrieved with $stateParams
            * */
            .state('project', {
                url: '/project/:projectID',
                templateUrl: 'page/project.html',
                controller: 'projectCtrl',
                controllerAs: 'pc'
            })
    })
    /**
    a directive made of voodoo by Scott that can make elements editable and ignore a firebaseObjects 3 way binding
     not in use but saved until can further understand
    * */
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


