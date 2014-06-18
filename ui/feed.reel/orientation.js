var Montage = require("montage/core/core").Montage;


var degtorad = Math.PI / 180; // Degree-to-Radian conversion

/**
 * @class Orientation
 * @extends Montage
 */
exports.Orientation = Montage.specialize(/** @lends Orientation# */ {

    constructor: {
        value: function Orientation() {
            this.super();
            var self = this;

            window.addEventListener('deviceorientation', function(event) {
                // We get a "deviceorientation" event when the page is brought back to the front.
                if(event.alpha !== null) {
                    if(!self._activated) {
                        self.reset(event.alpha, event.beta, event.gamma);
                        self._activated = true;
                    }
                    self._updateOrientation(event.alpha, event.beta, event.gamma);
                }
            }, false);
            this.addOwnPropertyChangeListener("orientation", this);
            this.addOwnPropertyChangeListener("_baseOrientation", this);
            this.addOwnPropertyChangeListener("type", this);
            this.addOwnPropertyChangeListener("magnitude", this);
            this.addOwnPropertyChangeListener("center", this);
            this.addOwnPropertyChangeListener("input", this);
        }
    },

    handlePropertyChange: {
        value: function(changeValue, key, object) {
            var output;
            if(!this._activated) {
                output = this.input;
            } else {
                var deltaAlpha = this.orientation[0] - this._baseOrientation[0];
                var deltaBeta = this.orientation[1] - this._baseOrientation[1];
                var deltaGamma = this.orientation[2] - this._baseOrientation[2];
                deltaAlpha = deltaAlpha * degtorad;
                deltaBeta = deltaBeta * degtorad;
                deltaGamma = deltaGamma * degtorad;
                if (this.type === "shift") {
                    output = this.shift(deltaAlpha, deltaBeta, deltaGamma);
                }
            }
            this.dispatchBeforeOwnPropertyChange("output", this._output);
            this._output = output;
            this.dispatchOwnPropertyChange("output", this._output);
        }
    },

    shift: {
        value: function (deltaAlpha, deltaBeta, deltaGamma) {
            var output = [
                this.input[0] - deltaBeta*this.magnitude,
                this.input[1] + deltaGamma*this.magnitude,
                this.input[2]
            ];
            return output;
        }
    },


    _updateOrientation: {
        value: function (alpha, beta, gamma) {
            this.orientation = [
                alpha + 0.8*(this.orientation[0] - alpha),
                beta + 0.8*(this.orientation[1] - beta),
                gamma + 0.8*(this.orientation[2] - gamma)
            ];
        }
    },

    reset: {
        value: function (alpha, beta, gamma) {
            if(alpha) {
                this._baseOrientation = [alpha, beta, gamma];
            } else {
                this._baseOrientation = this.orientation;
            }
        }
    },

    input: {
        value: null
    },

    output: {
        get: function () {
            return this._output;
        }
    },

    magnitude: {
        value: 1
    },

    type: {
        value: "shift"
    },

    center: {
        value: [0, 0, 0]
    },

    //initialized by reset() in constructor
    _baseOrientation: {
        value: null
    },

    _activated: {
        value: false
    },

    _output: {
        value: null
    },

    orientation: {
        value: [-90, 0, -45]
    }

});

