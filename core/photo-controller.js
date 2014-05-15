var Montage = require("montage").Montage;
var RangeController = require("montage/core/range-controller").RangeController;
//var CommentController = require/**/("./comment-controller").CommentController;

exports.PhotoController = Montage.specialize({

    constructor: {
        value: function PhotoController(photo, facebook) {
            this.photo = photo;
            this._facebook = facebook;
        }
    },

    photo: {
        value: null
    },

    _facebook: {
        value: null
    },

    _comments: {
        value: null
    },

    comments: {
        get: function () {
            var service = this;
            if(this._commentsPromise === null) {
                this._comments = new RangeController().initWithContent([]);
                this._comments.avoidsEmptySelection = true;
                this._commentsPromise = this._getComments()
                .then(function (commentControllers) {
                    service.comments.content.push.apply(service.comments.content, commentControllers);
                })
                .done();
            }
            return this._comments;
        }
    },

    _commentsPromise: {
        value: null
    },

    _getComments: {
        value: function () {
            return this._facebook
               .albumNamed(this.photo, "Comments")
               .then(function (comments) {
                   var commentControllers = [];
    //                        comments.forEach(function (comment) {
    //                            commentControllers.push(new CommentController(comment, facebook));
    //                        });
                   return commentControllers;
               });
        }
    }

});
