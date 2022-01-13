"use strict";

var utils = require("../utils/writer.js");
var Posts = require("../service/PostsService");

module.exports.createNewPost = function createNewPost(req, res, next, body) {
  Posts.createNewPost(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllPosts = function getAllPosts(req, res, next, status) {
  Posts.getAllPosts(status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFeed = function getFeed (req, res, next, visited, origin) {
    Posts.getFeed(visited, origin)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getPostsPublic = function getPostsPublic (req, res, next, origin) {
  Posts.getPostsPublic(origin)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
