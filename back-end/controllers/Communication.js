"use strict";
var utils = require("../utils/writer.js");
var Communication = require("../service/CommunicationService");

module.exports.receiveMessage = function receiveMessage(req, res, next, body) {
  Communication.receiveMessage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};



module.exports.privateMessagesofUserGET = function privateMessagesofUserGET(
  req,
  res,
  next,
  url
) {
  Communication.privateMessagesofUserGET(url)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.publicMessagesofUserGET = function publicMessagesofUserGET (req, res, next) {
  Communication.publicMessagesofUserGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};


module.exports.receiveMessagePOST = function receiveMessagePOST(
  req,
  res,
  next,
  body
) {
  Communication.receiveMessagePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sendMessagePOST = function sendMessagePOST(req, res, next) {
  Communication.sendMessagePOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sendPublicMessagePOST = function sendPublicMessagePOST (req, res, next,visited,origin,bouns) {
  //console.log("controler ok")
  Communication.sendPublicMessagePOST(visited,origin,bouns)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
