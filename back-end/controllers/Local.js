"use strict";

var utils = require("../utils/writer.js");
var Local = require("../service/LocalService");

module.exports.init = function init(req, res, next) {
  Local.init()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
