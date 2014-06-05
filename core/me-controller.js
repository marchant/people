/**
 * @module ./me-controller
 */

var UserController = require("./user-controller").UserController;
var facebookPromise = require("promise-facebook")("551585588293666");
/**
 * @class MeController
 * @extends Montage
 */
exports.MeController = UserController.specialize(/** @lends MeController# */ {
//TODO combine constructor and load
    constructor: {
        value: function MeController() {
            this.super();
        }
    },

    login: {
        value: function () {
            var self = this;
            this._loggedInFacebook =  facebookPromise.then(function (facebook) {
                self._facebook = facebook;
                return facebook.login({scope: 'user_photos,user_friends'});
            });
            this._loggedInFacebook.then(function (facebook) {

                return facebook.me().then(function (me) {
                    self.user = me;
                });
            })
            .done();
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
