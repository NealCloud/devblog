/**
 * Created by Mad Martigan on 3/28/2016.
 */
angular.module('cloudBlog')

.service("cloudServe", function(){
    var cloudServScope = this;
    var ref = new Firebase("https://nealcloud.firebaseio.com/cloudBlog")
    var auth = ref.getAuth();
    this.loggedIn = auth ? true : false;
    this.userData = auth || {};

    this.createPost = function(title, post){
        ref.child(userData.auth.uid).push({
                title:title,
                post:post
            });
    };

    this.logIn = function (name, pw){
        return ref.authWithPassword({
            email    : "buddy@bob.com",
            password : "buddybob"
        }, function(error, authData) {
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

    this.logOut = function(){
        return ref.unauth(function(){
            cloudServScope.loggedIn = false;
            cloudServScope.userData = {};
            console.log("logged out!");
        });
    }

});