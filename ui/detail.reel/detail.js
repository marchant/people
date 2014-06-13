/**
 * @module ui/detail.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var Q = require("montage/core/promise").Promise;

/**
 * @class Detail
 * @extends Component
 */
exports.Detail = Component.specialize(/** @lends Detail# */ {
    constructor: {
        value: function Detail() {
            this.super();
            this.addPathChangeListener("postController.imageLarge", this.handleNewImageLarge.bind(this));

        }
    },

    show: {
        value: function (startElement) {
            if(window.webkitConvertPointFromNodeToPage) {
                var startWidth = startElement.offsetWidth;
                var startHeight = startElement.offsetHeight;
                var endWidth = document.documentElement.clientWidth;
                var endHeight = document.documentElement.clientHeight;
                var startTopLeft = window.webkitConvertPointFromNodeToPage(startElement, new window.WebKitPoint(0, 0));
                var startBottomRight = window.webkitConvertPointFromNodeToPage(startElement, new window.WebKitPoint(startWidth, startHeight));
                var endBottomRight = new window.WebKitPoint(endWidth, endHeight);

                this.startX = startTopLeft.x;
                this.startY = startTopLeft.y;
                this.scaleX = (startBottomRight.x-startTopLeft.x)/endBottomRight.x;
                this.scaleY = (startBottomRight.y-startTopLeft.y)/endBottomRight.y;
            } else {
                this.startX = 0;
                this.startY = 0;
                this.scaleX = 0.1;
                this.scaleY = 0.1;
            }
            this._startElement = startElement;
            this.needsDraw = true;

        }
    },

    handleCloseAction: {
        value: function () {
            this.templateObjects.overlay.hide();

            this.dispatchEventNamed("closeDetail", true, true, {
                postController: this.postController
            });
            this.imageSource = null;
        }
    },

    willDraw: {
        value: function () {
            if(this._startElement) {
                this._clonedElement = this._copyNodes(this._startElement);
                // only do it once
                this._startElement = null;
            }
            this.detailPhotoRatio = this.detailPhoto.offsetWidth / this.detailPhoto.offsetHeight;
        }
    },

    draw: {
        value: function () {
            var self = this;
            var detailOverlay = this.detailOverlay;
            if (this.scaleX !== null) {
                detailOverlay.style.webkitTransform = ["translate3d(",this.startX,"px,",this.startY,"px, 0px) scale(",this.scaleX,",",this.scaleY ,")"].join('');
                this.templateObjects.overlay.show();
                this.scaleX = null;
                self._animationFinished = false;
                detailOverlay.classList.add("is-booting");
            } else if(this._startAnimation) {
                var naturalRatio = this.postController.imageSmall.width / this.postController.imageSmall.height;
                if (naturalRatio < this.detailPhotoRatio) {
                    detailOverlay.classList.add("is-tall");
                } else {
                    detailOverlay.classList.remove("is-tall");
                }
                detailOverlay.style.webkitTransform = "";
                detailOverlay.classList.remove("is-booting");
                this._startAnimation = false;
//                setTimeout(this.handleCloseAction.bind(this), 700);

            }
        }
    },

    didShowOverlay: {
        value: function () {
            var self = this;
            setTimeout(function () {
                self._startAnimation = true;
                self.needsDraw = true;
            }, 100);
            setTimeout(function () {
                self._animationFinished = true;
                if(self._imageSource) {
                    self.imageSource = self._imageSource;
                }
            }, 700);

        }
    },

    handleNewImageLarge: {
        value: function (plus) {
            if(plus) {
                this._imageSource = plus.source;
                if(this._animationFinished) {
                    this.imageSource = this._imageSource;
                }
            }
        }
    },


    _startAnimation: {
        value: false
    },

    _startElement: {
        value: null
    },

    _clonedElement: {
        value: null
    },

    startX: {
        value: null
    },

    startY: {
        value: null
    },

    scaleX: {
        value: null
    },

    scaleY: {
        value: null
    },

    postController: {
        value: null
    },

    _imageSource: {
        value: null
    },

    imageSource: {
        value: null
    },

    _copyNodes: {
        value: function (element) {
            var clonedElement = element.cloneNode(true);
            function copyCss(fromElement, toElement) {
                toElement.style.cssText = getComputedStyle(fromElement).cssText;
                var i = 0,
                fromElementLength = fromElement.children.length;
                for (i; i < fromElementLength; i++) {
                    copyCss(fromElement.children[i], toElement.children[i]);
                }
            }
            copyCss(element, clonedElement);
            return clonedElement;
        }
    }


});
