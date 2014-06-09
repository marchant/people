/**
 * @module ui/login.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

var meController = require("../../core/me-controller").shared;

/**
 * @class Login
 * @extends Component
 */
exports.Login = Component.specialize(/** @lends Login# */ {
    constructor: {
        value: function Login() {
            this.super();
            this.canDrawGate.setField("fbLoaded", false);
        }
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            // we need to make sure the button isn't shown before facebook
            // is loaded since login needs to be called synchronously
            meController.facebookReady.then(function () {
                self.canDrawGate.setField("fbLoaded", true);
            }).done();
            meController.facebookReady.then(function (facebook) {
                return facebook.getLoginStatus()
            })
            .then(function (response) {
                // then we don't need to login
                if(response.status === "connected") {
                    self.loader.removeContent();
                }
            }).done();
            this.templateObjects.overlay.show();

        }
    },

    handleLoginAction: {
        value: function () {
            this._initialDataLoad = meController.login();
            this.loader.removeContent();
        }
    }


});
