
var RangeController = require("montage/core/range-controller").RangeController;
var Q = require("montage/core/promise").Promise;

var FacebookController = require("./facebook-controller").FacebookController;
var PhotoController = require("./photo-controller").PhotoController;
var PostController = require("./post-controller").PostController;

exports.AlbumController = FacebookController.specialize({

    constructor: {
        value: function AlbumController(user, facebook) {
            this.super(user, facebook);
            this.user = user;
            this.album = user;
        }
    },

    user: {
        value: null
    },

    album: {
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
                .albumPhotos(self.album)
                .then(function (photos) {
                    var photoControllers = [];
                    photos.forEach(function (photo) {
                        photoControllers.push(new PostController(photo, self._facebook));
                    });
                    return photoControllers;
                });
        }
    }
});
