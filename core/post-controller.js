
var FacebookController = require("./facebook-controller").FacebookController;

exports.PostController = FacebookController.specialize({
    constructor: {
        value: function PostController(post, facebook) {
            this.super(post, facebook);
            this.post = post;
            this.type = this._determineType();
        }
    },

    // camelCase
    // jshint -W106
    _determineType: {
        value: function () {
            var post = this.post;
            if(post.type === "status") {
                if (typeof post.to !== "undefined") {
                    return "message";
                } else {
                    return "status";
                }
            } else if (post.type === "photo") {
                return "photo";
            } else if (post.type === "link") {
                return "link";
            }
        }
    },
    // jshint +W106

    post: {
        value: null
    },

    type: {
        value: null
    }

});
