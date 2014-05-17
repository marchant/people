var Composer = require("montage/composer/composer").Composer;
var Flow = require("montage/ui/flow.reel").Flow;

/**
 * @class Tween
 * @extends Composer
 */
exports.Tween = Composer.specialize(/** @lends Tween# */ {

    constructor: {
        value: function Tween() {
            this.super();
        }
    },

    load: {
        value: function () {
            this._updateCurrent(this.start);
        }
    },

    frame: {
        value: function() {
            var time = (Date.now() - this._startTime) / this.duration; // TODO: division by zero
            var interpolant = Flow.prototype._computeCssCubicBezierValue(time, eases[this.timingFunction]);
            var current = [];
            current[0] = this._actualStart[0] + (this._actualEnd[0] - this._actualStart[0]) * interpolant;
            current[1] = this._actualStart[1] + (this._actualEnd[1] - this._actualStart[1]) * interpolant;
            current[2] = this._actualStart[2] + (this._actualEnd[2] - this._actualStart[2]) * interpolant;
            this._updateCurrent(current);
            if (interpolant + 0.01 > 1) {
                this._end();
            } else {
                this.needsFrame = true;
            }
        }
    },

    _updateCurrent: {
        value: function (value) {
            this.dispatchBeforeOwnPropertyChange("current", this._current);
            this._current = value;
            this.dispatchOwnPropertyChange("current", this._current);
        }
    },


    _end: {
        value: function () {
            this._actualStart = null;
            this._actualEnd = null;
            this._isAnimating = false;
            //TODO dispatch event
        }
    },

    _animate: {
        value: function () {
            this._isAnimating = true;
            this._startTime = Date.now();
            this.needsFrame = true;
        }
    },


    forward: {
        value: function () {
            if(this._isAnimating) {
                this._actualStart = this._current;
                this._actualEnd = this.end;
            } else {
                this._actualStart = this.start;
                this._actualEnd = this.end;
            }
            this._animate();
        }
    },

    back: {
        value: function () {
            if(this._isAnimating) {
                this._actualStart = this._current;
                this._actualEnd = this.start;
            } else {
                this._actualStart = this.end;
                this._actualEnd = this.start;
            }
            this._animate();
        }
    },

    _startTime: {
        value: null
    },

    timingFunction: {
        value: "ease-in-out"
    },

    duration: {
        value: 500
    },

    start: {
        value: [0, 0, 0]
    },

    end: {
        value: [0, 0, 0]
    },

    _isAnimating: {
        value: false
    },

    isAnimating: {
        get: function () {
            return this._isAnimating;
        }
    },

    _current: {
        value: [0, 0, 0]
    },

    current: {
        get: function () {
            return this._current;
        }
    },

    _actualStart: {
        value: null
    },

    _actualEnd: {
        value: null
    },

    _forward: {
        value: true
    }

});


var eases = {
    "linear": [0.250, 0.250, 0.750, 0.750],
    "ease": [0.250, 0.100, 0.250, 1.000],
    "ease-in": [0.420, 0.000, 1.000, 1.000],
    "ease-out": [0.000, 0.000, 0.580, 1.000],
    "ease-in-out": [0.420, 0.000, 0.580, 1.000],

    "easeInQuad": [0.550, 0.085, 0.680, 0.530],
    "easeInCubic": [0.550, 0.055, 0.675, 0.190],
    "easeInQuart": [0.895, 0.030, 0.685, 0.220],
    "easeInQuint": [0.755, 0.050, 0.855, 0.060],
    "easeInSine": [0.470, 0.000, 0.745, 0.715],
    "easeInExpo": [0.950, 0.050, 0.795, 0.035],
    "easeInCirc": [0.600, 0.040, 0.980, 0.335],
    "easeInBack": [0.600, -0.280, 0.735, 0.045],

    "easeOutQuad": [0.250, 0.460, 0.450, 0.940],
    "easeOutCubic": [0.215, 0.610, 0.355, 1.000],
    "easeOutQuart": [0.165, 0.840, 0.440, 1.000],
    "easeOutQuint": [0.230, 1.000, 0.320, 1.000],
    "easeOutSine": [0.390, 0.575, 0.565, 1.000],
    "easeOutExpo": [0.190, 1.000, 0.220, 1.000],
    "easeOutCirc": [0.075, 0.820, 0.165, 1.000],
    "easeOutBack": [0.175, 0.885, 0.320, 1.275],

    "easeInOutQuad": [0.455, 0.030, 0.515, 0.955],
    "easeInOutCubic": [0.645, 0.045, 0.355, 1.000],
    "easeInOutQuart": [0.770, 0.000, 0.175, 1.000],
    "easeInOutQuint": [0.860, 0.000, 0.070, 1.000],
    "easeInOutSine": [0.445, 0.050, 0.550, 0.950],
    "easeInOutExpo": [1.000, 0.000, 0.000, 1.000],
    "easeInOutCirc": [0.785, 0.135, 0.150, 0.860],
    "easeInOutBack": [0.680, -0.550, 0.265, 1.550]
};

