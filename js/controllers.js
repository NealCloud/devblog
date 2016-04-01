/**
 * Created by Mad Martigan on 3/29/2016.
 */
angular.module('cloudBlog')
/**
* controller for the header
 * can call login and out
 * **/
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
    /**
     * controller for posts
     * currently not used
     * **/
    .controller("postCtrl", function(){

        var postsRef = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts");
        this.blogPosts = $firebaseObject(postsRef);

        this.toggleEdit = function (id, key, save) {
            console.log(id, this.blogPosts);
            //$scope.fakeMaster = angular.copy($scope.wobber);
            //console.log("before copy", this.fakeMaster);

            if (id in this.editmode) {
                this.editmode[id] = !this.editmode[id];
                if(save){
                    var editRef = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts/" + key);
                    editRef.update(this.blogPosts[key]);
                    //this.blogPosts.$save();
                }
                else{
                    //console.log("after copy", this.fakeMaster[key]);
                    //angular.copy(this.fakeMaster[key], this.blogPosts[key]);
                }
            }
            else {
                this.editmode[id] = true;
                //this.fakeMaster[key] = {};
                //angular.copy(this.blogPosts[key], this.fakeMaster[key]);
            }
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
            cloudServe.getTest();
        }
    })
    /**
     * controller for the splash page
     * calls a fireObject to be repeated and viewed
     * **/
    .controller("splashCtrl", function (cloudServe, $scope, $firebaseObject) {
        this.test = "tester";
        var splashScope = this;
        this.editmode = {};
        this.blogPosts = {};
        this.testFire = null;

        //TODO: turn projects into a list to make filters easier
        var projects = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/projects");
        this.blogProjects = $firebaseObject(projects);

        /**
         * Used for testing firebaseObjects
        * */
        var testref = new Firebase("https://nealcloud.firebaseio.com/cloudFire");
        var testObject = new $firebaseObject(testref);
        //testObject.$bindTo($scope, "data");
        testObject.$loaded().then(function() {
            testObject.$value = 233;
            testObject.$save();
            console.log(testObject.$value, testObject.$id, splashScope.blogPosts); // "bar"
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
    })
/**
 * controller for creating posts
* */
    .controller("writeBlog", function (cloudServe, $scope, cloudFireObj) {
        var writeScope = this;
        this.blogPost = {};
        this.blogPost.tags = {};
        this.router = "columnOne";
        this.blogPost.project = cloudServe.currentProject;
        this.possibleTags = cloudFireObj("tags");

        this.addTag = function(tag){
            console.log("adding ", tag);
            if(tag in this.blogPost.tags){

            }
            else{
                this.blogPost.tags[tag] = tag;
            }
        };

        this.removeTag = function(tag){
            delete this.blogPost.tags[tag]
        };

        this.postToBlog = function (post) {
            cloudServe.createPost(post)
                .then(function () {
                    console.log("write success", writeScope.title);
                    writeScope.title = "";
                    $scope.$digest();
                }, function () {
                    console.log("a fail");
                })
        }
    })
    /**
     * controller for project page
     * used for displaying/editing/deleting project posts
    * */
.controller("projectCtrl", function (cloudServe, $scope, cloudFireObj, $firebaseObject) {
    var projectScope = this;
    this.blogProject = {};
    this.blogPosts = [];
    this.editmode = {};
    this.fakeMaster = {};
    this.router = "columnOne";
    this.projects = cloudFireObj("projects");
/**function postToBlog
 * params post(obj)
 * sends a project to be created in firebase database
* */
    this.postToBlog = function (post) {
        cloudServe.createProject(post)
            .then(function () {
                console.log("write success", projectScope.title);
                projectScope.title = "";
                $scope.$digest();
            }, function () {
                console.log("a fail");
            })
    };
    /**function getProject
     * params post(obj)
     * grabs a firebase object by key name
     * */
    this.getProject = function(){
        var projectRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/projects');
        this.blogProject = $firebaseObject(projectRef.child($scope.$stateParams.projectID));
        cloudServe.setCurrentProject($scope.$stateParams.projectID);
    };
    /**function getProject
     * grabs a firebase object by key name
     * */
    this.getPosts = function(){
        var postsRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/posts');
        var query = postsRef.orderByChild('project').equalTo($scope.$stateParams.projectID);
        //console.log(query);
        query.once('value', function(snapshot){
            //console.log(snapshot.val());
            //projectScope.blogPosts = snapshot.val();
            //$scope.$digest();
            projectScope.blogPosts = [];
            snapshot.forEach(function(child){
                //console.log(child.val());
                projectScope.blogPosts.push({val:child.val(), key:child.key()});
                $scope.$digest();
                //$scope.$apply();
            })
        })
    };

    this.toggleEdit = function (id, key, save) {

        if (id in this.editmode) {
            this.editmode[id] = !this.editmode[id];
            if(save){
                var editRef = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts/" + key);
                editRef.update(this.blogPosts[id].val)
                    .then(function(){
                        console.log("updated!");
                        projectScope.getPosts();
                    });
            }
            else{
                angular.copy(projectScope.fakeMaster[key], projectScope.blogPosts[id].val);
            }
        }
        else {
            this.editmode[id] = true;
            this.fakeMaster[key] = {};
            angular.copy(this.blogPosts[id].val, this.fakeMaster[key]);
            console.log("after copy", this.fakeMaster[key]);
        }
    };

    this.deletePost = function (value) {
        console.log("Baleeted", value);
        cloudServe.deletePost(value)
            .then(function () {
                console.log("Baleeted");
                projectScope.getPosts();
            })
    };

});