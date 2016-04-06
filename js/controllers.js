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
                    console.log(response);
                }, function (error) {
                    console.log("THE " + error);
                })
        };

        this.logOut = function () {
            cloudServe.logOut()
                //.then(function () {
                    headScope.logged = false;
                    //$scope.$digest();
                //})
        }
    })

    /**
     * controller for the header
     * can call login and out
     * **/
    .controller("accountCtrl", function (cloudServe, $scope, cloudFireQuery, $firebaseArray) {
        var accountScope = this;
        this.logged = cloudServe.loggedIn;
        this.userData = cloudServe.userData;

        var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts/");
        console.log(this.userData);

        this.test = function (param) {
            console.log(param);
            console.log(this.userData);
        };

        //ref.orderByChild('project').equalTo(this.userData.auth.uid);
        //this.userPosts = $firebaseArray(ref.orderByChild('author').equalTo(this.userData.auth.uid));
        //this.userPosts = cloudFireQuery("posts","author",this.userData.auth.uid);
        this.logIn = function (email, password) {
            cloudServe.logIn(email, password)
                .then(function (response) {
                    accountScope.logged = true;
                    $scope.$digest();
                }, function (error) {
                    console.log("THE " + error);
                })
        };

        this.logOut = function () {
            cloudServe.logOut()
                .then(function () {
                    accountScope.logged = false;
                    $scope.$digest();
                })
        }
    })

    /**
     * controller for posts
     * currently not used
     * **/
    .controller("postCtrl", function () {

        var postsRef = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts");
        this.blogPosts = $firebaseObject(postsRef);

        this.toggleEdit = function (id, key, save) {
            console.log(id, this.blogPosts);
            //$scope.fakeMaster = angular.copy($scope.wobber);
            //console.log("before copy", this.fakeMaster);

            if (id in this.editmode) {
                this.editmode[id] = !this.editmode[id];
                if (save) {
                    var editRef = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts/" + key);
                    editRef.update(this.blogPosts[key]);
                    //this.blogPosts.$save();
                }
                else {
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

        this.deletePost = function (value, path) {
            cloudServe.deleteData(value, path)
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
     * controller for creating posts
     * */
    .controller("writeBlog", function (cloudServe, $scope, cloudFireObj) {
        var writeScope = this;
        this.blogPost = {};
        this.blogPost.tags = {};
        this.blogPost.public = true;
        this.router = "columnOne";

        this.userData = cloudServe.userData;
        this.blogPost.project = cloudServe.currentProject;

        this.possibleTags = cloudFireObj("tags");
        this.projNames = cloudFireObj("projectName");

        this.testlog = function(val){
            console.log(val);
        };

        this.time =  Date.now();
        /** function addTag:
         *  params: tag
         * */
        this.addTag = function (tag) {
            console.log(this.userData.auth.uid);
            console.log("adding ", tag);
            if (tag in this.blogPost.tags) {

            }
            else {
                this.blogPost.tags[tag] = this.possibleTags[tag];
            }
        };

        this.removeTag = function (tag) {
            delete this.blogPost.tags[tag]
        };

        this.postToBlog = function (post) {
            cloudServe.createPost(post)
                .then(function (response) {
                    console.log("write success",writeScope.blogPost.project, writeScope.blogPost.title, writeScope.blogPost.hours);
                    writeScope.blogPost.title = "";
                    if(writeScope.blogPost.project){
                        var projectRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/projects/' + writeScope.blogPost.project + "/hours");
                        projectRef.transaction(function(curHours){
                            return curHours + writeScope.blogPost.hours;
                        });
                    }

                    $scope.$digest();
                }, function () {
                    console.log("a fail");
                })
        }
    })
    /**
     * controller for the splash page
     * calls a fireObject to show all the projects
     * **/
    .controller("splashCtrl", function (cloudServe, $scope, $firebaseObject, cloudFireObj, cloudFireArray, $firebaseAuth) {
        this.test = "tester";
        var splashScope = this;
        this.testFire = null;
        this.projNames = cloudFireObj("projectName");
        this.currPage = 1;
        this.perPage = 4;
        this.maxPage = this.currPage + this.perPage - 2;
        this.minPage = 0;
        this.finalPage = 100;
        this.blogPosts = cloudFireArray("posts");
        this.users = cloudFireObj("users");

        this.timeConvert = cloudServe.timeConvert;
        this.userData = cloudServe.userData;

        this.countPage = function(val){
            this.finalPage = Math.ceil(this.blogPosts.length /this.perPage);
            if(val == -1 && this.currPage <= 1){
            }
            else if(val == 0){
                this.currPage = 1;
                this.maxPage = this.currPage + this.perPage - 2;
                this.minPage = 0;
            }
            else if(val == 1 && this.currPage >= this.finalPage){

            }
            else if (val == 'max'){
                this.currPage = this.finalPage;
                this.maxPage = this.blogPosts.length;
                this.minPage = this.blogPosts.length - this.perPage;
            }
            else if(val == -1){
                this.currPage += val;
                this.updatePage(-1 * this.perPage);
            }
            else if(val == 1){
                this.currPage += val;
                this.updatePage(this.perPage);
            }
        };

        this.test = function(){
            console.log(this.userData);
            cloudServe.testFire();
        };

        this.updatePage = function(val){
            this.maxPage += val;
            this.minPage += val;
            console.log(this.minPage, this.maxPage, this.currPage, this.finalPage);
        };


        /**
         * Used for testing firebaseObjects
         * */
        var testref = new Firebase("https://nealcloud.firebaseio.com/cloudFire");
        var testObject = new $firebaseObject(testref);
        //testObject.$bindTo($scope, "data");
        testObject.$loaded().then(function () {
            testObject.$value = 233;
            testObject.$save();
            console.log(testObject.$value, testObject.$id); // "bar"
            splashScope.testFire = testObject.$value;
        });

        this.testChange = function () {
            console.log("changin it! ", splashScope.testFire);
            testObject.$value = splashScope.testFire;
            testObject.$save();
        };

        this.keyTest = function (val) {
            console.log(val);
            console.log(this.projNames[val]);

        };
    })

    /**
     * controller for the Projects page
     * calls a fireArray to show all the projects
     * **/
    .controller("projectsCtrl", function (cloudServe,cloudFireObj, $scope, cloudFireArray) {
        this.test = "tester";
        this.timeConvert = cloudServe.timeConvert;
        var projectScope = this;
        this.blogProjects = cloudFireArray("projects");
        this.users = cloudFireObj("users");
    })
    /**
     * controller for a Projects page
     * used for displaying/editing/deleting project properties and posts
     * */
    .controller("projectCtrl", function (cloudServe, $scope, cloudFireObj,cloudFireArray, $firebaseObject) {
        var projectScope = this;
        this.blogProject = {};
        this.blogPosts = cloudFireArray("projects/" + $scope.$stateParams.projectID + "/posts");
        this.editmode = {};
        this.tempPost = {};
        this.router = "columnOne";
        this.projects = cloudFireObj("projects");
        this.users = cloudFireObj("users");
        this.blogProject.collaborators = {};
        this.userData = cloudServe.userData;

        this.projNames = cloudFireObj("projectName");
        this.currPage = 1;
        this.perPage = 3;
        this.maxPage = this.currPage + this.perPage - 2;
        this.minPage = 0;
        this.finalPage = 100;

        this.isAuthor = function(value){
            //console.log(value, this.userData.uid);
            return this.userData.uid == value;
        };
        this.testCall = function () {
            console.log(this.blogProject.author);
        };

        this.addPerson = function (id) {
            console.log("adding ", id);
            if (id in this.blogProject.collaborators) {

            }
            else {
                this.blogProject.collaborators[id] = "true";
            }
        };

        this.removeTag = function (person) {
            delete this.blogProject.collaborators[person];
        };

        this.timeConvert = cloudServe.timeConvert;

        this.countPage = function(val){
            this.finalPage = Math.ceil(this.blogPosts.length /this.perPage);
            if(val == -1 && this.currPage <= 1){
            }
            else if(val == 0){
                this.currPage = 1;
                this.maxPage = this.currPage + this.perPage - 2;
                this.minPage = 0;
            }
            else if(val == 1 && this.currPage >= this.finalPage){

            }
            else if (val == 'max'){
                this.currPage = this.finalPage;
                this.maxPage = this.blogPosts.length;
                this.minPage = this.blogPosts.length - this.perPage;
            }
            else if(val == -1){
                this.currPage += val;
                this.updatePage(-1 * this.perPage);
            }
            else if(val == 1){
                this.currPage += val;
                this.updatePage(this.perPage);
            }

        };

        this.test = function(){
            console.log(this.minPage, this.maxPage);
        };

        this.updatePage = function(val){
            this.maxPage += val;
            this.minPage += val;
            console.log(this.minPage, this.maxPage, this.currPage, this.finalPage);
        };


        /**function postToBlog
         * params post(obj)
         * sends a project to be created in firebase database
         * */
        this.postToBlog = function (post) {
            cloudServe.createProject(post)
                .then(function (response) {
                    console.log("write success", response.key(), post.title);
                    cloudServe.createProjectName(response.key(), post.title);
                    projectScope.title = "";
                    $scope.$digest();

                }, function () {
                    console.log("a fail");
                })
        };
        this.totalHours = function () {
            var count = 0;
            this.blogPosts.forEach(function (child) {

                if(child.hasOwnProperty('hours')){
                    console.log("adding");
                    count += child.val().hours;
                }
            });
            var projectRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/projects/' + $scope.$stateParams.projectID);
            projectRef.update({hours: count});
            //$scope.$apply();
        };
        /**function getProject
         * params post(obj)
         * grabs a Project in a firebase object by a key string based on the current url path
         * */
        this.getProject = function () {
            var projectRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/projects');
            this.blogProject = $firebaseObject(projectRef.child($scope.$stateParams.projectID));

            cloudServe.setCurrentProject($scope.$stateParams.projectID);
        };
        /**function getPosts
         * creates a fireObject of all posts that have same project id and pushes them to blogPosts
         * */


        this.getPosts = function () {

            var postsRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/posts');
            var query = postsRef.orderByChild('project').equalTo($scope.$stateParams.projectID);
            //console.log(query);
            query.once('value', function (snapshot) {

                //projectScope.blogPosts = snapshot.val();
                //$scope.$digest();
                projectScope.blogPosts = [];
                var count = 0;
                snapshot.forEach(function (child) {
                    if(child.hasOwnProperty('hours')){
                        count += child.val().hours;
                    }
                    projectScope.blogPosts.push({val: child.val(), key: child.key()});

                });
                var projectRef = new Firebase('https://nealcloud.firebaseio.com/cloudBlog/projects/' + $scope.$stateParams.projectID);
                projectRef.update({hours: count});
                $scope.$apply();
            });
        };

        //edits a post in place
        this.toggleEdit = function (value, key, save) {
            //checks if key property inside temp Post
            if (key in this.tempPost) {
                //check if user wants to save the edit and update
                if (save) {
                    var editRef = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/posts/" + key);
                    editRef.update(this.tempPost[key])
                        .then(function () {
                            console.log("updated!");
                            delete projectScope.tempPost[key];
                            projectScope.getPosts();
                        });
                }
                //otherwise delete the temporary property
                else {
                    delete this.tempPost[key];
                }
            }
            else {
                //if no key in temp create one and copy post info over and create an edit as true
                this.tempPost[key] = {};
                angular.copy(value, this.tempPost[key]);
            }
        };

        this.deleteData = function (key, path) {
            console.log("Baleeted", key, path);
            cloudServe.deleteData(key, path)
                .then(function () {
                    console.log("Baleeted");
                    projectScope.getPosts();
                })
        };

    })

