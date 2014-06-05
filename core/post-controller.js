
var FacebookController = require("./facebook-controller").FacebookController;
var meController = require("./me-controller");
var Promise = require("montage/core/promise").Promise;

exports.PostController = FacebookController.specialize({
    constructor: {
        value: function PostController(post, facebook) {
            this.super(post, facebook);
            this.post = post;
            this.type = this._determineType();
            this._determineFrom();
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

    _determineFrom: {
        value: function () {
            var self = this;
            var returnValue;
            if(this.type === "photo") {
                if (this.post.story_tags) {
                    this.from =  this.post.story_tags[Object.keys(this.post.story_tags).pop()][0];
                } else {
                    this.from = this.post.from;
                }
            } else {
                this.from = this.post.from;
            }
            // trigger fetch
            var friends = meController.shared.friends;

            meController.shared._friendsPromise.then(function (friends) {
                var friend;
                if(meController.shared.user.name  === self.from.name) {
                    friend = meController.shared.user;
                } else {
                    var i = 0;
                    var friendsLength = friends.length;
                    for (i; i < friendsLength; i++) {
                        friend = friends[i];
                        if(friend.name === self.from.name) {
                            break;
                        }
                    }
                }
                self._facebook.picture(friend)
                .then(function (picture) {
                    return self.from.picture = picture.url;
                }).done();
            });
            return returnValue;
        }
    },
    // jshint +W106

    post: {
        value: null
    },

    type: {
        value: null
    },

    _imageSmall: {
        value: null
    },

    _imageLarge: {
        value: null
    },

    imageSmall: {
        get: function () {
            var service = this;
            if(this._imagesPromise === null) {
                this._imagesPromise = this._getImages();
                this._imagesPromise.then(function (images) {
                    service.dispatchBeforeOwnPropertyChange("imageSmall", service._imageSmall);
                    service._imageSmall = images[1];
                    service.dispatchOwnPropertyChange("imageSmall", service._imageSmall);
                })
                .done();
            }
            return this._imageSmall;
        }
    },

    imageLarge: {
        get: function () {
            var service = this;
            if(this._imagesPromise === null) {
                this._imagesPromise = this._getImages();
                this._imagesPromise.then(function (images) {
                    service.dispatchBeforeOwnPropertyChange("imageLarge", service._imageLarge);
                    service._imageLarge = images[5];
                    service.dispatchOwnPropertyChange("imageLarge", service._imageLarge);
                })
                .done();
            }
            return this._imageLarge;
        }
    },

    _imagesPromise: {
        value: null
    },

    _getImages: {
        value: function () {
            var self = this;
            if(self.type === "photo") {
                // camelCase
                // jshint -W106
                return self._facebook.photoImages(self.post.object_id);
                // jshint +W106
            } else {
                return Promise.resolve([]);
            }
        }
    }

});
