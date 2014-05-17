/**
 * @module ./me-controller
 */
var Montage = require("montage/core/core").Montage;
var RangeController = require("montage/core/range-controller").RangeController;
var Q = require("montage/core/promise").Promise;

var FriendController = require("./friend-controller").FriendController;
var facebookPromise = require("promise-facebook")("551585588293666");
/**
 * @class MeController
 * @extends Montage
 */
exports.MeController = Montage.specialize(/** @lends MeController# */ {
//TODO combine constructor and load
    constructor: {
        value: function RottenTomatoService() {
            this.super();
        }
    },

    login: {
        value: function () {
            this._loggedInFacebook =  facebookPromise.then(function (facebook) {
                return facebook.login({scope: 'user_photos,user_friends'});
            });
            return this._loggedInFacebook;
        }
    },

    _loggedInFacebook: {
        value: null
    },

    _friends: {
        value: null
    },

    friends: {
        get: function () {
            var self = this;
            if(this._friendsPromise === null) {
                this._friends = new RangeController().initWithContent([]);
                this._friends.avoidsEmptySelection = true;
                this._friendsPromise = this._getFriends()
                    .then(function (friendControllers) {
                        self.friends.content.push.apply(self.friends.content, friendControllers);
                    })
                    .done();
            }
            return this._friends;
        }
    },

    _friendsPromise: {
        value: null
    },

    _getFriends: {
        value: function () {
            return this._loggedInFacebook.then(function (facebook) {
                return facebook
                    .myFriends()
                    .then(function (friends) {
                        return Q.all(friends.map(function (friend) {
                            return facebook.picture(friend, {redirect: true, type: "large"})
                                .then(function (picture) {
                                    friend.picture = picture;
                                    return friend;
                                });
                            }))
                            .then(function (friends) {
                                    var friendControllers = [];
                                    friends.forEach(function (friend) {
                                        if(friend.name === "Jenna Lingle") {
                                            friendControllers[1] = new FriendController(friend, facebook);
                                        } else {
                                            friendControllers.push(new FriendController(friend, facebook));
                                        }

                                    });
                                    return friendControllers;
                            });
                    });
            });
        }
    }

});

exports.shared = new exports.MeController();
