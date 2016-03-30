/**
 * Created by Mad Martigan on 3/29/2016.
 */
angular.module('cloudBlog')

    .controller("headCtrl", function (cloudServe, $scope) {
        var headScope = this;
        this.logged = cloudServe.loggedIn;
        this.userData = cloudServe.userData;

        this.test = function (param) {
            console.log(param);
            console.log(this.userData);
        };

        this.logIn = function (email, password) {
            cloudServe.logIn(email, password)
                .then(function (response) {

                    headScope.logged = true;
                    $scope.$digest();
                }, function (error) {
                    console.log("THE " + error);
                })
        };

        this.logOut = function () {
            cloudServe.logOut()
                .then(function () {
                    headScope.logged = false;
                    $scope.$digest();
                })
        }
    })

    .controller("splashCtrl", function (cloudServe, $scope, $firebaseObject) {
        this.test = "tester";
        var splashScope = this;
        this.editmode = {};
        this.posts = {};
        this.testFire = null;
        var testref = new Firebase("https://nealcloud.firebaseio.com/cloudFire");
        var testObject = new $firebaseObject(testref);
        //testObject.$bindTo($scope, "data");
        testObject.$loaded().then(function() {
            testObject.$value = 233;
            testObject.$save();
            console.log(testObject.$value, testObject.$id); // "bar"
            splashScope.testFire = testObject.$value;
        });

        this.testChange = function(){
            console.log("changin it! ", splashScope.testFire);
            testObject.$value = splashScope.testFire;
            testObject.$save();
        };

        this.returnTest = function(){
            return testObject;
        };

        this.fakeMaster = {};
        this.wobber = {yes: 2};
        var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts");
        this.posts = $firebaseObject(ref);
        //    .$loaded().then(function(){
        //        console.log("finished loading", splashScope.posts);
        //      splashScope.postsMaster = angular.copy(splashScope.posts);
        //});
        //posts.$bindTo($scope, "allPost");

        this.toggleEdit = function (id, key, save) {
            //console.log(id, this.posts);
            //$scope.fakeMaster = angular.copy($scope.wobber);
            //console.log("before copy", this.fakeMaster);

            if (id in this.editmode) {
                this.editmode[id] = !this.editmode[id];
                if(save){
                    this.posts.$save();
                }
                else{
                    console.log("after copy", this.fakeMaster[key]);
                    angular.copy(this.fakeMaster[key], this.posts[key]);
                }
            }
            else {
                this.editmode[id] = true;
                this.fakeMaster[key] = {};
                angular.copy(this.posts[key], this.fakeMaster[key]);
                this.fakeMaster
            }

        };

        //this.allUserPosts = function () {
        //    console.log("getting posts");
        //    cloudServe.getPosts()
        //        .then(function (response) {
        //            console.log(response.val());
        //            splashScope.posts = response.val();
        //            splashScope.postsMaster = splashScope.posts;
        //            $scope.$digest();
        //            // splashScope.posts = $firebaseObject(ref);
        //        });
        //};

        this.deletePost = function (value) {
            cloudServe.deletePost(value)
                .then(function () {
                    console.log("Baleeted");
                    //splashScope.allUserPosts();
                })
        };

        this.allUserPosts = function () {

        };

        this.keyTest = function (e) {
            console.log("yolo", e);
        }
    })

    .controller("writeBlog", function (cloudServe, $scope) {
        var writeScope = this;

        this.router = "columnOne";

        this.postToBlog = function (title, post) {
            cloudServe.createPost(title, post)
                .then(function () {
                    console.log("write success", writeScope.title);
                    writeScope.title = "";
                    $scope.$digest();
                }, function () {
                    console.log("a fail");

                })
        }
    });