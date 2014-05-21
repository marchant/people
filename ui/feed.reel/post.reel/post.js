
var Component = require("montage/ui/component").Component;
var PressComposer = require("montage/composer/press-composer").PressComposer;

exports.Post = Component.specialize( {

    constructor: {
        value: function Post() {
            this.super();
        }
    },

    enterDocument: {
        value: function () {
            this._pressComposer = new PressComposer();
            this._pressComposer.identifier = "selection";
            this.addComposerForElement(this._pressComposer, this._switchElement);
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._pressComposer.addEventListener('pressStart', this, false);
            this._pressComposer.addEventListener('press', this, false);
            this._pressComposer.addEventListener('pressEnd', this, false);
        }
    },

    handleSelectionPressStart: {
        value: function () {

        }
    },


    handleSelectionPress: {
        value: function () {
            this.dispatchEventNamed("showDetail", true, true, {
                post: this.post,
                startElement: this._switchElement
            });
        }
    },

    handleSelectionPressEnd: {
        value: function () {

        }
    },

    postController: {
        value: null
    },

    _pressComposer: {
        value: null
    },

    _switchElement: {
        value: null
    }

});
