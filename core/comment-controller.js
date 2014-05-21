
var FacebookController = require("./facebook-controller").FacebookController;

exports.CommentController = FacebookController.specialize({
    constructor: {
        value: function CommentController(comment, facebook) {
            this.super(comment, facebook);
            this.comment = comment;
        }
    },

    comment: {
        value: null
    }

});
