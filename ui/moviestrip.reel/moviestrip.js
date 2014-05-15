
var Component   = require("montage/ui/component").Component;

exports.Moviestrip = Component.specialize({

    constructor: {
        value: function Moviestrip () {
            this.super();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.movieDetails.defineBinding(
                    "classList.has('details-fade-out')",
                    {
                        "<-": "$self._detailsHidden",
                        parameters: { self: this }
                    }
                );
            }
        }
    },

    _photosController: {
        value: null
    },

    photosController: {
        get: function () {
            return this._photosController;
        },
        set: function (value) {
            if (value == null) { return; }
            this._photosController = value;
            if (this._photosController == null) {
                // first time
                this._displayedContentController = this._photosController;
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
                if (self.templateObjects && self.templateObjects.photoFlow) {
                    self.templateObjects.photoFlow.scroll = 14;
                }
                self._displayedContentController = self.photosController;
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

    _flowHidden: {
        value: false
    },

    _detailsHidden: {
        value: false
    }

});
