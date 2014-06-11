
var Component = require("montage/ui/component").Component;
var PressComposer = require("montage/composer/press-composer").PressComposer;

exports.Post = Component.specialize( {

    constructor: {
        value: function Post() {
            this.super();
            this.defineBinding("postController", {"<-": "iteration.object"});
            this.addPathChangeListener("iteration.selected", this, "selectionChange");
            this.defineBinding("classList.has('is-photo' )", {"<-": "postController.type == 'photo'"});
            this.defineBinding("classList.has('is-link' )", {"<-": "postController.type == 'link'"});
            this.defineBinding("classList.has('is-message' )", {"<-": "postController.type == 'status' || postController.type == 'message'"});
            this.defineBinding("classList.has('is-tag' )", {"<-": "postController.post.status_type == 'tagged_in_photo'"});
        }
    },

    enterDocument: {
        value: function () {
            this._pressComposer = new PressComposer();
            this._pressComposer.identifier = "selection";
            this._pressComposer.delegate = this;
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._pressComposer.addEventListener('pressStart', this, false);
            this._pressComposer.addEventListener('press', this, false);
            this._pressComposer.addEventListener('pressEnd', this, false);
        }
    },

    selectionChange: {
        value: function (value) {
            var self = this;
            if(value) {
                if (this.postController.type === "photo") {
                    this.dispatchEventNamed("showDetail", true, true, {
                        postController: this.postController,
                        startElement: this._postWrapper
                    });
                    setTimeout(function () {
                        self.classList.add("is-shown");
                    }, 100);
                } else if (this.postController.type === "link") {
                    window.open(this.postController.post.link, "link");
                }
            } else {
                this.classList.remove("is-shown");
            }

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

    _postController: {
        value: null
    },

    postController: {
        get: function () {
            return this._postController;
        },
        set: function (value) {
            this._postController = value;
        }
    },

    _pressComposer: {
        value: null
    },

    _switchElement: {
        value: null
    }

});
