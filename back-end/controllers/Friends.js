"use strict";

var utils = require("../utils/writer.js");
var Friends = require("../service/FriendsService");

module.exports.addMe = function addMe(req, res, next, body, situation) {
  Friends.addMe(body, situation)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllFriends = function getAllFriends(req, res, next, status) {
  Friends.getAllFriends(status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.notify = function notify(req, res, next, from, action) {
  Friends.notify(from, action)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.me = function me(req, res, next) {
  Friends.me()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
