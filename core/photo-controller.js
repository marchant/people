
var FacebookController = require("./facebook-controller").FacebookController;

exports.PhotoController = FacebookController.specialize({

    constructor: {
        value: function PhotoController(photo, facebook) {
            this.super(photo, facebook);
            this.photo = photo;
            this.post = photo;
        }
    },

    photo: {
        value: null
    }

});
