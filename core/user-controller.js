
var RangeController = require("montage/core/range-controller").RangeController;
var Q = require("montage/core/promise").Promise;

var FacebookController = require("./facebook-controller").FacebookController;
var PhotoController = require("./photo-controller").PhotoController;
var PostController = require("./post-controller").PostController;
var AlbumController = require("./album-controller").AlbumController;

exports.UserController = FacebookController.specialize({

    constructor: {
        value: function UserController(user, facebook) {
            this.super(user, facebook);
            this.user = user;
        }
    },

    user: {
        value: null
    },

    _facebook: {
        value: null
    },

    _photos: {
        value: null
    },

    photos: {
        get: function () {
            var service = this;
            if(this._photosPromise === null) {
                this._photos = new RangeController().initWithContent([]);
                this._photos._origin = this;
                this._photosPromise = this._getPhotos()
                .then(function (photoControllers) {
                    service.photos.content.push.apply(service.photos.content, photoControllers);
                })
                .done();
            }
            return this._photos;
        }
    },

    _photosPromise: {
        value: null
    },

    _getPhotos: {
        value: function () {
            var self = this;
            return self._facebook
                .albums(self.user)
                .then(function (albums) {
                    return Q.all(
                        albums.map(function (album) {
                            return self._facebook.albumPhotos(album);
                        })
                    );
                })
                .then(function (photosForAlbum) {
                    var allPhotos = [];
                    photosForAlbum.map(function (photos) {
                        allPhotos.push.apply(allPhotos, photos);
                    });
                    return allPhotos;
                })
                .then(function (photos) {
                    var photoControllers = [];
                    photos.forEach(function (photo) {
                        photoControllers.push(new PostController(photo, self._facebook));
                    });
                    return photoControllers;
                });
        }
    },

    _feed: {
        value: null
    },

    feed: {
        get: function () {
            var service = this;
            if(this._feedPromise === null) {
                this._feed = new RangeController().initWithContent([]);
                this._feed._origin = this;
                this._feedPromise = this._getFeed()
                .then(function (feed) {
                    var postControllers = [];
                    feed.forEach(function (post) {
                        postControllers.push(new PostController(post, service._facebook));
                    });
                    return postControllers;
                })
                //preload a certian number of images
                .then(function (postControllers) {
                    return Q.all(postControllers.slice(0,20).map(function (postController) {
                        postController.imageSmall;
                        return postController._imagesPromise;
                    })).thenResolve(postControllers);
                })
                .then(function (postControllers) {
                    service.feed.content.push.apply(service.feed.content, postControllers);
                })
                .done();
            }
            return this._feed;
        }
    },

    _feedPromise: {
        value: null
    },

    _friends: {
        value: null
    },

    friends: {
        get: function () {
            var self = this;
            if(this._friendsPromise === null) {
                this._friends = new RangeController().initWithContent([]);
                this._friendsPromise = this._getFriends();
                this._friendsPromise.then(function (friends) {
                    if (false && friends.length !== 0) {
                        var userControllers = [];
                        friends.map(function (friend) {
                            userControllers.push(new exports.UserController(friend, self._facebook));
                        });
                        self.friends.content.push.apply(self.friends.content, userControllers);
                    } else {
                        return self._facebook
                            .albums(self.user)
                            .then(function (albums) {
                                var albumControllers = [];
                                albums.map(function (album) {
                                    albumControllers.push(new AlbumController(album, self._facebook));
                                });
                                self.friends.content.push.apply(self.friends.content, albumControllers);
                            });
                    }
                })
                .done();
            }
            return this._friends;
        }
    },

    _friendsPromise: {
        value: null
    },

    _getFriends: {
        value: function () {
            return this._facebook.friends(this.friend);
        }
    },

    _getFeed: {
        value: function () {
            return this._facebook.feed(this.friend);
        }
    }

});
