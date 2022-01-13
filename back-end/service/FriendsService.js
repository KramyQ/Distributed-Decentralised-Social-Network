"use strict";

const DICTIONNARY_BACK = {
  8000: "first",
  8001: "second",
  8002: "third",
  8003: "fourth",
  8004: "fifth",
};

const API_VALUE = "/Sr05-Project/Distributed_Facebook_API/1.0.0/";

const query = require("../db/db-connection");

/**
 * Add me as friend
 *
 * body List List of user object
 * no response value expected for this operation
 **/
exports.addMe = function (body, situation) {
  return new Promise(function (resolve, reject) {
    //Get myself in the friends databse
    let sql = `SELECT * FROM Friends where me = 1`;
    let user = {};
    query(sql).then((res) => {
      //Return our name in order for the origin to be able to insert us
      if (res.length > 0) {
        user["name"] = res[0].name;
        resolve(user);
      }
      //Check if the to be add user is already in the database
      sql = `SELECT * FROM Friends where url = ?`;
      const jsonParse = JSON.parse(body);
      let data = [jsonParse.url];
      query(sql, data).then((res) => {
        //Already in => if already friend do nothing, if not we need to check if the request has been generated to accept a pending request
        if (res.length > 0) {
          if(situation == "delete"){
            sql = `DELETE FROM Friends where url = ?`;
            query(sql, data).then((res) => {});
          }
          if (
            (res[0].statut === "pending" && situation === "out") ||
            (res[0].statut === "waiting" && situation === "in")
          ) {
            sql = `UPDATE Friends set statut = ? where url = ?`;
            data = ["friend", jsonParse.url];
            query(sql, data).then((res) => {});
          }
        }
        //Not in the db => insertion with a status depending of the source of the request (us or outside)
        else {
          sql = `insert into Friends (name,url,statut,url_backend) values (?,?,?,?)`;
          let backend_value =
            DICTIONNARY_BACK[jsonParse.url.split(":")[2].split("/")[0]];
          let data = [
            jsonParse.name,
            jsonParse.url,
            "waiting",
            "http://" + backend_value + "_server_1:8000" + API_VALUE,
          ];
          if (situation === "in") {
            data[2] = "pending";
          }
          query(sql, data).then((res) => {});
        }
      });
    });
  });
};

/**
 * Get friends from receiving user
 * Get friends from receiving user
 *
 * status User Status values that need to be considered for filter
 * returns List
 **/
exports.getAllFriends = function (status) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM Friends where statut != 0`;
    query(sql).then((res) => {
      var resultJson = [];
      resultJson[0] = JSON.stringify(res);
      if (Object.keys(resultJson).length > 0) {
        resolve(resultJson[Object.keys(resultJson)[0]]);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Notify the the targeted user than you are connected
 * Say that you are connected
 *
 * no response value expected for this operation
 **/
exports.notify = function (from, action) {
  return new Promise(function (resolve, reject) {
    let sql = `UPDATE Friends set connected = ? where url LIKE ?`;
    let data = [action === "login" ? 1 : 0, "%:" + from + "%"];
    query(sql, data).then((res) => {
      resolve();
    });
    resolve();
  });
};

/**
 * Get the friend that correspond to the current node user
 * Retrieve me.
 *
 * returns User
 **/
exports.me = function () {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM Friends where me != 0`;
    query(sql).then((res) => {
      var resultJson = [];
      console.log("res.length", res.length);
      if (res.length !== 1) {
        reject({
          message: "error : " + res.length + " user identified as 'me' found",
        });
      }
      console.log(
        "Object.keys(resultJson).length ",
        Object.keys(resultJson).length
      );
      resultJson[0] = JSON.stringify(res);
      if (Object.keys(resultJson).length > 0) {
        resolve(resultJson[Object.keys(resultJson)[0]]);
      }
    });
  });
};
