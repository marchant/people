
var FacebookController = require("./facebook-controller").FacebookController;

exports.PostController = FacebookController.specialize({
    constructor: {
        value: function PostController(post, facebook) {
            this.super(post, facebook);
            this.post = post;
        }
    },

    post: {
        value: null
    }
});
