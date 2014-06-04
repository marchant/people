/**
 * @module ui/menu.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Menu
 * @extends Component
 */
exports.Menu = Component.specialize(/** @lends Menu# */ {
    constructor: {
        value: function Menu() {
            this.super();
        }
    },

    _isExpanded: {
        value: false
    },

    handleSelectedFeedAction: {
        value: function () {
            this._isExpanded = !this._isExpanded;
            if (this._isExpanded) {
                this.classList.add("expanded");
            } else {
                this.classList.remove("expanded");
            }
        }
    }
});
