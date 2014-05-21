
var RangeController = require("montage/core/range-controller").RangeController;
var Q = require("montage/core/promise").Promise;

var FacebookController = require("./facebook-controller").FacebookController;
var PhotoController = require("./photo-controller").PhotoController;
var PostController = require("./post-controller").PostController;

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
                this._photos.avoidsEmptySelection = true;
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
                .albums(self.friend)
                .then(function (albums) {
                    return albums[0];
                })
                .then(function (album) {
                    return self._facebook.albumPhotos(album);
                })
                .then(function (photos) {
                    var photoControllers = [];
                    photos.forEach(function (photo) {
                        photoControllers.push(new PhotoController(photo, self._facebook));
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
                this._feed.avoidsEmptySelection = true;
                this._feedPromise = this._getFeed()
                .then(function (feed) {
                    var postControllers = [];
                    feed.forEach(function (post) {
                        postControllers.push(new PostController(post, service._facebook));
                    });
                    return postControllers;
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
                this._friends.avoidsEmptySelection = true;
                this._friendsPromise = this._getFriends()
                    .then(function (friends) {
                        return Q.all(friends.map(function (friend) {
                            return facebook.picture(friend, {redirect: true, type: "large"})
                                .then(function (picture) {
                                    friend.picture = picture;
                                    return friend;
                                });
                            }))
                            .then(function (friends) {
                                var userControllers = [];
                                friends.forEach(function (friend) {
                                    if(friend.name === "Jenna Lingle") {
                                        userControllers[1] = new UserController(friend, facebook);
                                    } else {
                                        userControllers.push(new UserController(friend, facebook));
                                    }

                                });
                                return userControllers;
                            });
                    })
                    .then(function (userControllers) {
                        self.friends.content.push.apply(self.friends.content, userControllers);
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
