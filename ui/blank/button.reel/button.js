/**
 * @module ui/blank/button.reel
 * @requires montage/ui/component
 */
var AbstractButton = require("montage/ui/base/abstract-button").AbstractButton;

/**
 * @class Button
 * @extends AbstractButton
 */
exports.Button = AbstractButton.specialize(/** @lends Button# */ {
    constructor: {
        value: function Button() {
            this.super();
        }
    }
});
