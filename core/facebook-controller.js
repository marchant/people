var Montage = require("montage").Montage;
var RangeController = require("montage/core/range-controller").RangeController;

exports.FacebookController = Montage.specialize({
    constructor: {
        value: function FacebookController(object, facebook) {
            this._object = object;
            this._facebook = facebook;
        }
    },

    _facebook: {
        value: null
    },

    _object: {
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
                .then(function (comments) {
                    var commentControllers = [];
                    comments.forEach(function (comment) {
                        commentControllers.push(new CommentController(comment, service._facebook));
                    });
                    return commentControllers;
                })
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
            return this._facebook.comments(this._object);
        }
    },

    _likes: {
        value: null
    },

    likes: {
        get: function () {
            var service = this;
            if(this._likesPromise === null) {
                this._likesPromise = this._facebook.likes(this._object)
                .then(function (likes) {
                    service._likes = likes;
                })
                .done();
            }
            return this._likes;
        }
    },

    _likesPromise: {
        value: null
    }

});
var CommentController = require("./comment-controller").CommentController;
