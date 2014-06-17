/**
 * @module ui/facebook-logo.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FacebookLogo
 * @extends Component
 */
exports.FacebookLogo = Component.specialize(/** @lends FacebookLogo# */ {
    constructor: {
        value: function FacebookLogo() {
            this.super();
        }
    },

    _opacity: {
        value: 1
    },

    opacity: {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            var opacity = parseFloat(value);

            if (opacity < 0) {
                opacity = 0;
            }
            if (opacity > 1) {
                opacity = 1;
            }
            opacity = (Math.cos((1 - opacity) * Math.PI) + 1) * .5;
            if (this._opacity !== opacity) {
                this._opacity = opacity;
                this.needsDraw = true;
            }
        }
    },

    draw: {
        value: function (timestamp) {
            this.logo.style.opacity = this._opacity;
            this.opacity = (Math.sin(timestamp * .005) + 1) * .5;
            this.needsDraw = true;
        }
    }
});
