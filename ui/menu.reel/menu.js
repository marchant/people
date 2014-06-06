/**
 * @module ui/menu.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Menu
 * @extends Component
 */
exports.Menu = Component.specialize(/** @lends Menu# */ {
    constructor: {
        value: function Menu() {
            this.super();
            this._selectedFeedName = this.myFeedName;
            this.defineBinding("classList.has('expanded')", {"<-": "_isExpanded"});
            this.defineBinding("selectedFriend", {"<-": "friendsController.selection.one()"});
        }
    },

    _isExpanded: {
        value: false
    },

    handleToggleAction: {
        value: function () {
            this._isExpanded = !this._isExpanded;
        }
    },

    handleSelectMyFeedAction: {
        value: function () {
            this._isExpanded = false;
            this.postsController = this.meController.feed;
            this._selectedFeedName = this.myFeedName;
            this.friendsController.clearSelection();
        }
    },

    _selectedFriend: {
        value: null
    },

    selectedFriend: {
        get: function () {
            return this._selectedFriend;
        },
        set: function (value) {
            this._selectedFriend = value;
            if(value) {
                this._isExpanded = false;
                this.postsController = value.photos;
                this._selectedFeedName = value.user.name;
            }
        }
    },

    _meController: {
        value: null
    },

    meController: {
        get: function () {
            return this._meController;
        },
        set: function (value) {
            this._meController = value;
            this.friendsController = value.friends;
            this.postsController = value.feed;
        }
    },

    friendsController: {
        value: null
    },

    postsController: {
        value: null
    },

    _selectedFeedName: {
        value: null
    },

    myFeedName: {
        value: "My Feed"
    }
});
