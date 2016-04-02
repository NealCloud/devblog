/**
 * Created by Mad Martigan on 3/28/2016.
 * the service and factories used in Dev cloudBlog
 */
angular.module('cloudBlog')
    /**
     * main service used
    * */
    .service("cloudServe", function () {
        var cloudServScope = this;
        var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog"); //main firebase ref
        var auth = ref.getAuth(); // retrieve auth status from firebase
        this.loggedIn = auth ? true : false; // establish if logged in
        this.userData = auth || {}; // the user data
        this.currentProject = ""; // the current project key

        this.timeConvert = function(value){
            var time = new Date(value);
            return time.toDateString();
        };
        //setter function to set the current project key used for sending storing key when writing a new post
        this.setCurrentProject = function(value){
            this.currentProject = value + "";
        };
        /** function: create a project
         *  params postObj(object) contains all data needed to create a project
         *  uses object data to make a new project in firebase
        * */
        this.createProject = function (projectObj) {
            var user = {};
            user[this.userData.auth.uid] = true;
            return ref.child("projects").push({
                author: this.userData.auth.uid,
                title: projectObj.title || "big Zero",
                description: projectObj.description || "no words to describe its awesomeness",
                created: Firebase.ServerValue.TIMESTAMP,
                tags: projectObj.tags || {notag: "notag"},
                rating: 0,
                public: projectObj.public || false,
                collaborators: projectObj.collaborators || user,
                completed: false,
                hours: 0,
                repo: projectObj.repo || null,
                picture: "https://"
            });
        };
        /** function: create a post
         *  params postObj(object) contains all data needed to create a post
         *  uses object data to make a new post in firebase
         * */
        this.createPost = function (postObj) {
            return ref.child("posts").push({
                author: this.userData.auth.uid,
                avatar: this.userData.password.profileImageURL,
                title: postObj.title || "no title",
                post: postObj.post || "no words",
                created: Firebase.ServerValue.TIMESTAMP,
                tags: postObj.tags || {notag: "notag"},
                rating: 0,
                public: postObj.public || false,
                project: postObj.project || "general",
                hours: postObj.hours || 0
            });
        };
        /** function: delete a Post
         *  params key(string) contains a firebase key string
         *  uses a key to call remove on a firebase ref
         * */
        this.deleteData = function (key, path) {
            //console.log("removing ", key);
            var userblog = ref.child(path);
            return userblog.child(key).remove(); //returns to trigger a promise
        };
        /** function: get Test
         *  used to test queries to firebase
         * */
        this.getTest = function () {
            console.log("getting posts");
            //ref.child("bots").push({id: this.userData.auth.uid, test: 12, text: "yo I'm a bot"});
            ref.child("bots").once("value", function (snap) {
                console.log(snap.val());
                // return snap.val();
            });
        };
        /** function: logIn
         *  params name(string) pw(string) uses name and password to verify account
         *  uses strings to login to firebase
         * */
        this.logIn = function (name, pw) {
            //calls firebase authorize function
            return ref.authWithPassword({
                email: "buddy@bob.com",
                password: "buddybob"
            }, function (error, authData) {
                if (error) {
                    //error detection should be disabled after deployed
                    switch (error.code) {
                        case "INVALID_EMAIL":
                            console.log("The specified user account email is invalid.");
                            break;
                        case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            break;
                        case "INVALID_USER":
                            return "The specified user account does not exist.";
                            break;
                        default:
                            console.log("Error logging user in:", error);
                    }
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    cloudServScope.userData = authData;
                    cloudServScope.loggedIn = false;
                }
            });
        };
        /** function: logout
         *  uses firebase logout to function to revoke access
         * */
        this.logOut = function () {
            //calls firebase unauthorize function
            return ref.unauth(function () {
                cloudServScope.loggedIn = false;
                cloudServScope.userData = {};
                console.log("logged out!");
            });
        }

    })
/**
 * factory that returns a firebaseObject inside cloudBlog depending on path given
* */
.factory("cloudFireObj", ["$firebaseObject", function($firebaseObject) {
        return function(path) {
            var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/");
            var pathRef = ref.child(path);
            return $firebaseObject(pathRef);
        }
    }
])
.factory("cloudFireArray", function($firebaseArray) {
        return function(path) {
            var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/");
            var pathRef = ref.child(path);
            return $firebaseArray(pathRef);
        }
    }
);