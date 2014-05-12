
var Component = require("montage/ui/component").Component;

exports.Details = Component.specialize({

    constructor: {
        value: function Details() {
            this.super();
        }
    },


    _movie: {
        value: null
    },

    movie: {
        set: function (val) {
            this._movie = val;
            this.needsDraw = true;
        },
        get: function () {
            return this._movie;
        }
    },

    draw: {
        value: function () {
            if (this.movie) {
                if (this._isDetailsExpanded) {
                    this._element.classList.add("expanded");
                } else {
                    this._element.classList.remove("expanded");
                }
            }
        }
    },

    handleRentButtonAction: {
        value: function () {
            window.open( this.movie.links.alternate );
        }
    },

    handleTrailerButtonAction: {
        value: function () {
            this.dispatchEventNamed("openTrailer", true, true, {title: this.movie.title});
        }
    },

    _isDetailsExpanded: {
        value: false
    },

    handleExpandButtonAction: {
        value: function () {
            this._isDetailsExpanded = !this._isDetailsExpanded;
            this.needsDraw = true;
        }
    }
});
