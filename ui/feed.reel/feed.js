
var Component   = require("montage/ui/component").Component;

exports.Feed = Component.specialize({

    constructor: {
        value: function Feed () {
            this.super();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
//                this.movieDetails.defineBinding(
//                    "classList.has('details-fade-out')",
//                    {
//                        "<-": "$self._detailsHidden",
//                        parameters: { self: this }
//                    }
//                );
            }
        }
    },

    _postsController: {
        value: null
    },

    postsController: {
        get: function () {
            return this._postsController;
        },
        set: function (value) {
            if (value == null) { return; }
            this._postsController = value;
            if (this._postsController == null) {
                // first time
                this._displayedContentController = this._postsController;
                this._flowHidden = false;
            } else {
                this._startChangeCategoryTransition();
            }
        }
    },

    _displayedContentController: {
        value: null
    },

    _startChangeCategoryTransition: {
        value: function () {
            var self = this;

            this._detailsHidden = true;
            this._flowHidden = true;

            // wait .5s until the fade in/out effect is completed
            setTimeout( function () {
                // reset the flow to initial scroll position
                if (self.templateObjects && self.templateObjects.feedFlow) {
                    self.templateObjects.feedFlow.scroll = 0;
                }
                self._displayedContentController = self.postsController;
                self._flowHidden = false;
                self._detailsHidden = false;
            }, 800 );
        }
    },

    movieFlowDidTranslateStart: {
        value: function () {
            this._detailsHidden = true;
        }
    },

    movieFlowDidTranslateEnd: {
        value: function (flow) {
            var scroll = Math.round(flow.scroll);
            if(this._displayedContentController) {
                this._displayedContentController.select(this._displayedContentController.content[scroll]);
            }
            this._detailsHidden = false;

        }
    },

    zoomIn: {
        value: function () {
            this.templateObjects.tween.back();
            this._zoomed = true;
            this.classList.add("is-zoomedIn");
        }
    },

    zoomOut: {
        value: function () {
            this.templateObjects.tween.forward();
            this._zoomed = false;
            this.classList.remove("is-zoomedIn");

        }
    },

    handleShowDetail: {
        value: function (event) {
            this.templateObjects.detail.postController = event.detail.postController;
            this.templateObjects.detail.show(event.detail.startElement);

        }
    },

    handleCloseDetail: {
        value: function () {
            this._postsController.clearSelection();
        }
    },

    _flowHidden: {
        value: false
    },

    _detailsHidden: {
        value: false
    }

});
