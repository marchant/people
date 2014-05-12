/* global FB,module*/
/**
 * @module facebook
 */
var Promise = require("montage/core/promise").Promise;

var FACEBOOK_ID = "facebook-jssdk";

var deferred;

module.exports = function (appId) {
    //deferred is null the first time, after that, always the same.
    if(!deferred) {
        deferred = Promise.defer();
        if (document.getElementById(FACEBOOK_ID)) {
            // Facebook is already loaded
            deferred.reject(new Error("Facebook is already loaded."));
        } else {
            window.fbAsyncInit = function() {
                deferred.resolve(FB);
            };
            var scriptElement = document.createElement('script');
            scriptElement.src = "//connect.facebook.net/en_US/sdk.js";
            scriptElement.id = FACEBOOK_ID;
            document.head.appendChild(scriptElement);
        }
    }
    return deferred.promise
    .then(function (facebook) {
        facebook.init({
            appId      : appId,
            xfbml      : true,
            version    : 'v2.0'
        });
        return decorate(facebook);
    });
};

function decorate(facebook) {
    var newFacebook = Object.create(facebook);
    newFacebook.login = function (params) {
        var deferred = Promise.defer();
        facebook.login(
            function(response) {
                if (response.authResponse) {
                    deferred.resolve(newFacebook);
                } else {
                    deferred.reject(new Error(response.error));
                }
            },params);
        return deferred.promise;
    };
    newFacebook.api = function (path, method, params) {
        var deferred = Promise.defer();
        var args = [path];
        if(typeof method === "string") {
            args.push(method);
        }
        if(typeof params === "object") {
            args.push(params);
        }
        args.push(function(response) {
            if (response && response.error) {
                deferred.reject(new Error(response.error));
            } else {
                deferred.resolve(response.data);
            }
        });
        facebook.api.apply(facebook, args);
        return deferred.promise;
    };
    return newFacebook;
}
