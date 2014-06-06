/**
 * @module ./me-controller
 */

var UserController = require("./user-controller").UserController;
var facebookPromise = require("promise-facebook")("551585588293666");
var Q = require("montage/core/promise").Promise;

var loggedInDeferred;

/**
 * @class MeController
 * @extends Montage
 */
exports.MeController = UserController.specialize(/** @lends MeController# */ {
//TODO combine constructor and load
    constructor: {
        value: function MeController() {
            this.super();
            var self = this;
            facebookPromise.then(function (facebook) {
                self.__loadedFacebook = facebook;
            }).done();
            loggedInDeferred = Q.defer();
            this._loggedInFacebook = loggedInDeferred.promise;
        }
    },

    facebookReady: {
        value: facebookPromise
    },

    login: {
        value: function () {
            var self = this;
            this._loggedInFacebook = this.__loadedFacebook.login({scope: 'user_photos,user_friends'}).then(function (facebook) {
                self._facebook = facebook;
                loggedInDeferred.resolve(facebook);
//                self._loggedInFacebook = facebook;
                return facebook;

            });
            this._loggedInFacebook.then(function (facebook) {
                return facebook.me().then(function (me) {
                    self.user = me;
                });
            }).done();
            return this._loggedInFacebook;
        }
    },

    _loggedInFacebook: {
        value: null
    },

    _getFriends: {
        value: function () {
            return this._loggedInFacebook.then(function (facebook) {
                return facebook.myFriends();
            });
        }
    },

    _getFeed: {
        value: function () {
            return this._loggedInFacebook.then(function (facebook) {
                return facebook.myFeed();
            });
        }
    }

});

exports.shared = new exports.MeController();
