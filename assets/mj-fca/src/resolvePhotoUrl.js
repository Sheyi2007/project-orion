"use strict";

var utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
    return function resolvePhotoUrl(photoID, callback) {
        var resolveFunc = function () {};
        var rejectFunc = function () {};
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        if (!callback) {
            callback = function (err, friendList) {
                if (err) {
                    return rejectFunc(err);
                }
                resolveFunc(friendList);
            };
        }

        defaultFuncs
            .get("https://www.facebook.com/mercury/attachments/photo", ctx.jar, {
                photo_id: photoID,
            })
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then((resData) => {
                if (resData.error) {
                    throw resData;
                }

                var photoUrl = resData.jsmods.require[0][3][0];

                return callback(null, photoUrl);
            })
            .catch((err) => {
                utils.logged("fca_resolve_photo_url " + err);
                return callback(err);
            });

        return returnPromise;
    };
};