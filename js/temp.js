/**
 * Created by Mad Martigan on 4/5/2016.
 */
/**
 * controller for a Projects page
 * used for displaying/editing/deleting project properties and posts
 * */
angular.module('tempApp')
.controller("projectCtrl", function (cloudServe, $scope, cloudFireObj,cloudFireArray, $firebaseObject) {
    var projectScope = this;
    this.blogProject = {};
    this.blogPosts = []; //cloudFireArray("posts");
    this.editmode = {};
    this.tempPost = {};
    this.router = "columnOne";
    this.projects = cloudFireObj("projects");
    this.users = cloudFireObj("users");
    this.blogProject.collaborators = {};

    this.projNames = cloudFireObj("projectName");
    this.currPage = 1;
    this.perPage = 4;
    this.maxPage = this.currPage + this.perPage - 2;
    this.minPage = 0;
    this.finalPage = 100;

    this.isAuthor = function(value){
        return cloudServe.user.id = value;
    };


    this.addPerson = function (id) {
        console.log("adding ", id);
        if (id in this.blogProject.collaborators) {

        }
        else {
            this.blogProject.collaborators[id] = this.users[id].name;
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
            .then(function () {
                console.log("write success", projectScope.title);
                projectScope.title = "";
                $scope.$digest();
            }, function () {
                console.log("a fail");
            })
    };
    this.totalHours = function () {

    }
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
    this.testCall = function () {
        console.log(this.blogPosts);
    };

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