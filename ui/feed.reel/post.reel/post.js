
var Component = require("montage/ui/component").Component;
var PressComposer = require("montage/composer/press-composer").PressComposer;

exports.Post = Component.specialize( {

    constructor: {
        value: function Post() {
            this.super();
            this.defineBinding("postController", {"<-": "iteration.object"});
            this.addPathChangeListener("iteration.selected", this, "selectionChange");
        }
    },

    enterDocument: {
        value: function () {
            this._pressComposer = new PressComposer();
            this._pressComposer.identifier = "selection";
            this._pressComposer.delegate = this;
//            this.addComposerForElement(this._pressComposer, this._switchElement);
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
                postController: this.postController,
                startElement: this._switchElement
            });
            this.classList.add("is-shown");
            this.postController.addEventListener("closeDetail", this, true);
        }
    },

    selectionChange: {
        value: function (value, second, thris) {
            if(value) {
                this.dispatchEventNamed("showDetail", true, true, {
                     postController: this.postController,
                     startElement: this._switchElement
                 });
                 this.classList.add("is-shown");
            } else {
                this.classList.remove("is-shown");
            }

        }
    },


    handleCloseDetail: {
        value: function () {
            this.classList.remove("is-shown");
            this.postController.removeEventListener("closeDetail", this, true);
        }
    },


    handleSelectionPressEnd: {
        value: function () {

        }
    },

    selectionSurrenderPointer: {
        value: function () {
            return true;
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
