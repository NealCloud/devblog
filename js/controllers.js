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

        var testref = new Firebase("https://nealcloud.firebaseio.com/cloudFire");
        var syncObject = $firebaseObject(testref);
        syncObject.$bindTo($scope, "data");
        syncObject.$value = 42;

        var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts");
        var posts = $firebaseObject(ref);
        posts.$bindTo($scope, "allPost");

        this.toggleEdit = function (id) {
            console.log(id);
            if (id in this.editmode) {
                this.editmode[id] = !this.editmode[id];
            }
            else {
                this.editmode[id] = true;
            }

        };

        this.allUserPosts = function () {
            console.log("getting posts");
            cloudServe.getPosts()
                .then(function (response) {
                    console.log(response.val());
                    splashScope.posts = response.val();
                    $scope.$digest();
                    // splashScope.posts = $firebaseObject(ref);
                });
        };

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