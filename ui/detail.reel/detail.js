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
                this.point = window.webkitConvertPointFromNodeToPage(startElement, new window.WebKitPoint(0, 0));
            } else {
                this.point = {x:0,y:0};
            }
            this._startElement = startElement;
            this._showOverlay = true;
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
            if(this._startAnimation) {
                this.elementWidth = this._startElement.offsetWidth;
                this.elementHeight = this._startElement.offsetHeight;
                this.imageWidth = this.postController.imageSmall.width;
                this.imageHeight = this.postController.imageSmall.height;
                this.screenWidth = this.zoomedImageWrapper.offsetWidth;
                this.screenHeight = this.zoomedImageWrapper.offsetHeight;
            }
        }
    },

    draw: {
        value: function () {
            var zoomedImageWrapper = this.zoomedImageWrapper,
            clippedZoomedImage = this.clippedZoomedImage,
            zoomedImage = this.templateObjects.imageSmall.element,
            spacer = this.spacer,
            clip1 = this.clip1,
            clip2 = this.clip2,
            clip,
            imageWidth = this.imageWidth,
            imageHeight = this.imageHeight,
            elementWidth = this.elementWidth,
            elementHeight = this.elementHeight,
            point,
            elementX,
            elementY,
            uncroppedX,
            uncroppedY,
            screenWidth,
            screenHeight,
            uncroppedWidth,
            uncroppedHeight,
            targetWidth,
            targetHeight,
            zoom;

            if(this._showOverlay) {
                this._showOverlay = false;

                this.templateObjects.overlay.show();


                //setup all the flags
                this._animationFinished = false;
                this._startAnimation = false;
                this._animationStepTwo = false;
                this._animationStepThree = false;
            } else if (this._startAnimation) {
                this._startAnimation = false;

                point = this.point;
                elementX = point.x;
                elementY = point.y;

                screenWidth = this.screenWidth;
                screenHeight = this.screenHeight;

                if (imageWidth * screenHeight > imageHeight * screenWidth) {
                    targetWidth = imageWidth * screenHeight / imageHeight;
                    targetHeight = screenHeight;
                } else {
                    targetWidth = screenWidth;
                    targetHeight = imageHeight * screenWidth / imageWidth;
                }
                targetWidth |= 0;
                targetHeight |= 0;
                if (imageWidth * elementHeight > imageHeight * elementWidth) {
                    uncroppedWidth = imageWidth * elementHeight / imageHeight;
                    //                 uncroppedHeight = elementHeight;
                    uncroppedX = elementX - (uncroppedWidth - elementWidth) * 0.5;
                    uncroppedY = elementY;
                    zoom = elementHeight / targetHeight;
                    clip = (targetWidth - (elementWidth * targetHeight / elementHeight)) * 0.5;
                    zoomedImage.style.webkitTransform = "translate3d(" + clip + "px,0,0)";
                    clip2.style.webkitTransform = "translate3d(" + (-clip * 2) + "px,0,0)";
                    clip1.style.webkitTransform = "translate3d(" + clip + "px,0,0)";
                } else {
                    //                 uncroppedWidth = elementWidth;
                    uncroppedHeight = imageHeight * elementWidth / imageWidth;
                    uncroppedX = elementX;
                    uncroppedY = elementY - (uncroppedHeight - elementHeight) * 0.5;
                    zoom = elementWidth / targetWidth;
                    clip = (targetHeight - (elementHeight * targetWidth / elementWidth)) * 0.5;
                    zoomedImage.style.webkitTransform = "translate3d(0," + clip + "px,0)";
                    clip2.style.webkitTransform = "translate3d(0," + (-clip * 2) + "px,0)";
                    clip1.style.webkitTransform = "translate3d(0," + clip + "px,0)";
                }
                clippedZoomedImage.style.width = targetWidth + "px";
                clippedZoomedImage.style.height = targetHeight + "px";
                zoomedImage.style.width = targetWidth + "px";
                zoomedImage.style.height = targetHeight + "px";
                clip1.style.width = targetWidth + "px";
                clip1.style.height = targetHeight + "px";
                clip2.style.width = targetWidth + "px";
                clip2.style.height = targetHeight + "px";
                spacer.style.width = targetWidth + "px";
                spacer.style.height = targetHeight + "px";
                if (imageWidth * screenHeight > imageHeight * screenWidth) {
                    uncroppedX += (targetWidth - screenWidth) >> 1;
                    zoomedImageWrapper.classList.remove("scroll");
                    zoomedImageWrapper.scrollLeft = (targetWidth - screenWidth) >> 1;
                    zoomedImageWrapper.scrollTop = 0;
                } else {
                    zoomedImageWrapper.classList.remove("scroll");
                    zoomedImageWrapper.scrollLeft = 0;
                    uncroppedY += (targetHeight - screenHeight) >> 1;
                    zoomedImageWrapper.scrollTop = (targetHeight - screenHeight) >> 1;
                }
                clippedZoomedImage.style.webkitTransform = "translate3d(" + uncroppedX + "px," + uncroppedY + "px,0) scale3d(" + zoom + "," + zoom + ",1)";
                clippedZoomedImage.style.webkitTransition = "none";
                zoomedImage.style.webkitTransition = "none";
                clip2.style.webkitTransition = "none";
                clip1.style.webkitTransition = "none";
                clippedZoomedImage.style.opacity = 0;

                this._animationStepTwo = true;
                this.needsDraw = true;
            } else if (this._animationStepTwo) {
                this._animationStepTwo = false;

                zoomedImageWrapper.classList.add("scroll");
                clippedZoomedImage.style.webkitTransition = "500ms -webkit-transform ease-in-out";
                zoomedImage.style.webkitTransition = "500ms -webkit-transform ease-in-out";
                clip2.style.webkitTransition = "500ms -webkit-transform ease-in-out";
                clip1.style.webkitTransition = "500ms -webkit-transform ease-in-out";

                this._animationStepThree = true;
                this.needsDraw = true;
            } else if (this._animationStepThree) {
                this._animationStepThree = false;

                clippedZoomedImage.style.webkitTransform = "translate3d(0,0,0) scale3d(1,1,1)";
                zoomedImage.style.webkitTransform = "translate3d(0,0,0)";
                clip2.style.webkitTransform = "translate3d(0,0,0)";
                clip1.style.webkitTransform = "translate3d(0,0,0)";
                clippedZoomedImage.style.opacity = 1;
            }
        }
    },

    didShowOverlay: {
        value: function () {
            var self = this;
            self._startAnimation = true;
            self.needsDraw = true;
            setTimeout(function () {
                self._animationFinished = true;
                if(self._imageSource) {
                    self.imageSource = self._imageSource;
                }
            }, 550);

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
