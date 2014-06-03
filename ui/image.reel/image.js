
var AbstractImage = require("montage/ui/base/abstract-image").AbstractImage;

exports.Image = AbstractImage.specialize( {

    constructor: {
        value: function Image() {
            this.super();
        }
    },

    draw: {
        value: function () {
            var src;
            if (this._isLoadingImage || this._isInvalidSrc) {
                src = this.emptyImageSrc;
            } else {
                src = this._getRebasedSrc();
            }
            if (typeof src !== "undefined") {
                this._element.style.backgroundImage = "url(" + src + ")";
            }
        }
    }

});
