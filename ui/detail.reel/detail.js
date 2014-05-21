/**
 * @module ui/detail.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Detail
 * @extends Component
 */
exports.Detail = Component.specialize(/** @lends Detail# */ {
    constructor: {
        value: function Detail() {
            this.super();
        }
    },

    show: {
        value: function (startElement) {
            if(webkitConvertPointFromNodeToPage) {

                var startTopLeft = webkitConvertPointFromNodeToPage(startElement, new WebKitPoint(0, 0));
                var startBottomRight = webkitConvertPointFromNodeToPage(startElement, new WebKitPoint(startElement.offsetWidth, startElement.offsetHeight));
                var endBottomRight = new WebKitPoint(document.documentElement.clientWidth, document.documentElement.clientHeight);

                this.startX = startTopLeft.x;
                this.startY = startTopLeft.y;
                this.scaleX = (startBottomRight.x-startTopLeft.x)/endBottomRight.x;
                this.scaleY = (startBottomRight.y-startTopLeft.y)/endBottomRight.y;
            } else {
                this.startX = document.documentElement.clientWidth/2;
                this.startY =  document.documentElement.clientHeight/2;
                this.scaleX = 0.1;
                this.scaleY = 0.1;
            }
            this.needsDraw = true;

        }
    },

    draw: {
        value: function () {
            var overlay = this.templateObjects.detailOverlay;
            if (this.scaleX !== null) {
                overlay.element.style.webkitTransform = ["scale(",this.scaleX,",",this.scaleY ,") translate3d(",this.startX,"px,",this.startY,"px, 0px)"].join('');
                this.templateObjects.detailOverlay.show();
                this.scaleX = null;
            } else if(this._startAnimation) {
                overlay.element.style.webkitTransform = "";
                this._startAnimation = false;
            }
        }
    },

    didShowOverlay: {
        value: function (overlay) {
            this._startAnimation = true;
            this.needsDraw = true;
        }
    },

    _startAnimation: {
        value: false
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

    post: {
        value: null
    }

});
