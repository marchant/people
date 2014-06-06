
var Component = require("montage/ui/component").Component;
var PressComposer = require("montage/composer/press-composer").PressComposer;

exports.Post = Component.specialize( {

    constructor: {
        value: function Post() {
            this.super();
            this.defineBinding("postController", {"<-": "iteration.object"});
            this.addPathChangeListener("iteration.selected", this, "selectionChange");
        }
    },

    enterDocument: {
        value: function () {
            this._pressComposer = new PressComposer();
            this._pressComposer.identifier = "selection";
            this._pressComposer.delegate = this;
//            this.addComposerForElement(this._pressComposer, this._switchElement);
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._pressComposer.addEventListener('pressStart', this, false);
            this._pressComposer.addEventListener('press', this, false);
            this._pressComposer.addEventListener('pressEnd', this, false);
        }
    },

    handleSelectionPressStart: {
        value: function () {

        }
    },


    handleSelectionPress: {
        value: function () {
            this.dispatchEventNamed("showDetail", true, true, {
                postController: this.postController,
                startElement: this._switchElement
            });
            this.classList.add("is-shown");
            this.postController.addEventListener("closeDetail", this, false);
        }
    },

    selectionChange: {
        value: function (value, second, thris) {
            if(value) {
                this.dispatchEventNamed("showDetail", true, true, {
                    postController: this.postController,
                    startElement: this._postWrapper
                });
                window.postController = this.postController;
                this.classList.add("is-shown");
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
    },

    _months: {
        value: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
    },

    _date: {
        value: null
    },

    date: {
        get: function () {
            return this._date;
        },
        set: function (value) {
            if (typeof value === "string") {
                var year = value.substr(0, 4) * 1,
                    month = value.substr(5, 2) * 1,
                    day = value.substr(8, 2) * 1,
                    hours = value.substr(11, 2) * 1,
                    minutes = value.substr(14, 2) * 1,
                    now = new Date(),
                    today = new Date(now.getFullYear(), now.getMonth(), now.getDay()).valueOf(),
                    yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDay() - 1).valueOf(),
                    postDay = new Date(year, month - 1, day - 1).valueOf(),
                    time;

                if (postDay === today) {
                    this._date = "Today";
                } else {
                    if (postDay === yesterday) {
                        this._date = "Yesterday";
                    } else {
                        this._date = this._months[month - 1] + " " + day;
                    }
                }
                if (hours < 12) {
                    if (hours) {
                        time = hours + ":" + minutes + "am";
                    } else {
                        // 00:00 is 12:00am
                        time = "12:" + minutes + "am";
                    }
                } else {
                    time = (hours - 12) + ":" + minutes + "pm";
                }
                this._date += " at " + time;
            }
        }
    }

});
