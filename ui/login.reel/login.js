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
        }
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            // we need to make sure the button isn't shown before facebook
            // is loaded since login needs to be called synchronously
            meController.facebookReady.then(function (facebook) {
                return facebook.getLoginStatus();
            })
            .then(function (response) {
                // then we don't need to login
                if(response.status === "connected") {
                    meController.loadWithoutLogin()
                    .then(function () {
                        self.ownerComponent.classList.add("is-loggedIn");
                        self._shouldShowOverlay = false;
                    }).done();
                } else {
                    self._shouldShowOverlay = true;
                    self._showOverlayIfNecessary();
                }
            })
            .done();
        }
    },

    _shouldShowOverlay: {
        value: false
    },

    _enteredDocument: {
        value: false
    },

    _showOverlayIfNecessary: {
        value: function () {
            var self = this;
            if(this._shouldShowOverlay && this._enteredDocument) {
                setTimeout(function () {
                    self.templateObjects.overlay.show();
                }, 0);
            }
        }
    },

    enterDocument: {
        value: function () {
            this._enteredDocument = true;
            this._showOverlayIfNecessary();
        }
    },


    handleLoginAction: {
        value: function () {
            var self = this;
            meController.login()
            .then(function () {
                self.ownerComponent.classList.add("is-loggedIn");
                self.templateObjects.overlay.hide();
            }).done();

        }
    }


});
