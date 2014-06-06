
var Component = require("montage/ui/component").Component,
    meController = require("../../core/me-controller").shared;

//TODO use details in toggle buttons
//TODO do not use matte toggle buttons
exports.Main = Component.specialize({

    constructor: {
        value: function Main () {
            this.application.addEventListener( "openTrailer", this, false);

            this.canDrawGate.setField("dataLoaded", false);
            this._initialDataLoad = this.meController._loggedInFacebook;
        }
    },

    meController: {
        value: meController
    },

    _initialDataLoad: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            self._initialDataLoad.then(function () {
                self.canDrawGate.setField("dataLoaded", true);
            }).done();
        }
    },

    _zoomed: {
        value: true
    },

    handleMenuButtonAction: {
        value: function () {
            if (this._zoomed) {
                this.templateObjects.feed.zoomOut();
                this._zoomed = false;
            } else {
                this.templateObjects.feed.zoomIn();
                this._zoomed = true;
            }

        }
    },

    /**
        iOS 7.0.x iPhone/iPod Touch workaround. After switching from portrait to landscape
        mode, Safari shows the content full screen. If the top or bottom of the content is
        clicked, navigation bars appear hiding content. This workaround reduces the height
        of the content.
    */
    _windowScroll: {
        value: function (self) {
            if ((window.innerHeight === window.outerHeight) || (window.innerHeight !== this._element.offsetHeight)) {
                window.scrollTo(0, 0);
                self.templateObjects.feed.feedFlow.handleResize();
                window.clearTimeout(self._windowScrollTimeout);
                self._windowScrollTimeout = window.setTimeout(function () {
                    self._windowScroll(self);
                }, 700);
            }
        }
    },

    /**
        iOS 7.0.x iPhone/iPod Touch workaround
    */
    _windowScrollTimeout: {
        value: null
    },

    handleOrientationchange: {
        value: function () {
            var self = this;

            window.scrollTo(0, 0);
            // iOS 7.0.x iPhone/iPod Touch workaround
            if (navigator.userAgent.match(/(iPhone|iPod touch);.*CPU.*OS 7_0_\d/i)) {
                window.clearTimeout(this._windowScrollTimeout);
                if (Math.abs(window.orientation) === 90) {
                    self._windowScrollTimeout = window.setTimeout(function () {
                        self._windowScroll(self);
                    }, 1000);
                }
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                window.addEventListener("orientationchange", this, false);
            }
        }
    }

});
