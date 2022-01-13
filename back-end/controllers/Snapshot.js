'use strict';

var utils = require('../utils/writer.js');
var Snapshot = require('../service/SnapshotService');



module.exports.getSnapshot = function getSnapshot ( req,
                                                    res,
                                                    next,
                                                    url) {
  Snapshot.getSnapshot(url)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMsgHistory = function getMsgHistory (req, res, next) {
  Snapshot.getMsgHistory()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFriendHistory = function getFriendHistory (req, res, next) {
  Snapshot.getFriendHistory()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSnapshot = function updateSnapshot (req, res, next, body, url) {
    Snapshot.updateSnapshot(body, url)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
