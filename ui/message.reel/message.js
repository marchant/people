/**
 * @module ui/message.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Message
 * @extends Component
 */
exports.Message = Component.specialize(/** @lends Message# */ {
    constructor: {
        value: function Message() {
            this.super();
        }
    }
});
