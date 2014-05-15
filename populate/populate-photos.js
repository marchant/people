var APP_ID = "551585588293666";
var ACCESS_TOKEN = process.env["ACCESS_TOKEN"];

var facebook = require("promise-facebook")(APP_ID, ACCESS_TOKEN);

var Q = require("q");
Q.longStackSupport = true;

var newUserData = require("./users");

facebook
.then(function (facebook) {

    return facebook
    //.deleteAllTestUsers()
    .user("100008394750995")
    // Create test users from data
    .then(function (user) {
        if (users.length > 1) {
            return users;
        } else {
            return Q.all(newUserData.map(function (userData) {
                return facebook.newTestUser()
                    .then(function (user) {
                        return facebook.updateUser(user, {
                                "password": userData.Password,
                                "name": userData.GivenName + " " + userData.Surname
                            })
                            //so that we have the users for next operation
                            .thenResolve(user);
                    });
            }));
        }
    });
    // Now all users have been created
    // make them friends
    // not working right now
//    .then(function (newUsers) {
//        return Q.all(
//                newUsers.map(function (userAsking) {
//                    newUsers.map(function (userReceiving) {
//                        return facebook.makeFriendAndAccept(userAsking, userReceiving);
//                    });
//                })
//            )
//            .thenResolve(newUsers);
//    })
})
.done();
