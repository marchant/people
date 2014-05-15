var Montage = require("montage").Montage;
var RangeController = require("montage/core/range-controller").RangeController;
var PhotoController = require("./photo-controller").PhotoController;

exports.FriendController = Montage.specialize({

    constructor: {
        value: function FriendController(friend, facebook) {
            this.friend = friend;
            this._facebook = facebook;
        }
    },

    friend: {
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
    }

});
