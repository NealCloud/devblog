/**
 * Created by Mad Martigan on 3/28/2016.
 */
angular.module('cloudBlog')

    .service("cloudServe", function () {
        var cloudServScope = this;
        var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog")
        var auth = ref.getAuth();
        this.loggedIn = auth ? true : false;
        this.userData = auth || {};

        this.createPost = function (postObj) {
            return ref.child("posts").push({
                author: this.userData.auth.uid,
                title: postObj.title,
                post: postObj.post,
                created: Firebase.ServerValue.TIMESTAMP,
                tags: postObj.tags,
                rating: 0,
                public: postObj.public
            });
        };

        this.deletePost = function (key) {
            console.log("removing ", key);
            var userblog = ref.child("posts");
            return userblog.child(key).remove();
        };

        this.getPosts = function () {
            console.log("getting posts");
            //ref.child("bots").push({id: this.userData.auth.uid, test: 12, text: "yo I'm a bot"});
            ref.child("bots").once("value", function (snap) {
                console.log(snap.val());
                // return snap.val();
            });
        };

        this.logIn = function (name, pw) {
            return ref.authWithPassword({
                email: "buddy@bob.com",
                password: "buddybob"
            }, function (error, authData) {
                if (error) {
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
                }
            });
        };

        this.logOut = function () {
            return ref.unauth(function () {
                cloudServScope.loggedIn = false;
                cloudServScope.userData = {};
                console.log("logged out!");
            });
        }

    })

.factory("cloudFireObj", ["$firebaseObject",
    function($firebaseObject) {
        return function(path) {
            var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog/");
            var pathRef = ref.child(path);
            return $firebaseObject(pathRef);
        }
    }
]);