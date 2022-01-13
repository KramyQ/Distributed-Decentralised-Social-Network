'use strict';
const query = require("../db/db-connection");
const fetch = require("node-fetch");

/**
 * used to ask data to others
 * Ask a certain snapshot
 *
 * no response value expected for this operation
 **/
exports.getSnapshot = function (url) {
    return new Promise(function (resolve, reject) {

        console.log("service getSnapshot");
        // let sql = `SELECT * FROM Snapshot where url like ?`;
        let sql = `SELECT * FROM Snapshot where url like ?`;
        let data = [decodeURI(url).toString()]
        console.log("the data : ",data)
        query(sql, data).then((res) => {
            console.log("in service getSnapshot")
            var resultJson = [];
            resultJson[0] = JSON.stringify(res);
            if (Object.keys(resultJson).length > 0) {
                resolve(resultJson[Object.keys(resultJson)[0]]);
            } else {
                resolve(url);
            }
        }).catch((e) => reject({message: e.message}));
    });
};


module.exports.updateSnapshot = function updateSnapshot(body, url) {
    Snapshot.updateSnapshot(url)
    return new Promise(function (resolve, reject) {

        const jsonParsed = JSON.parse(body);
        let isFriend = `SELECT * FROM Friends where url=?`;
        let dataUrl = [decodeURI(url).toString()]

        query(isFriend, dataUrl).then((res) => {
            if (res.length <= 0) {
                reject({message: "this data doesn't belong here because not a friend"});
            }
            const existYet = "SELECT * FROM Snapshot WHERE url like ?";
            query(existYet, data).then((res) => {
                if (res.length <= 0) {
                    const sqlInsertNewSnapshot = `INSERT INTO Snapshot (data, lastUpdate, url) values (?,?,?)`;
                    query(sqlInsertNewSnapshot, [body, jsonParsed.lastUpdate, dataUrl]).then((res) => {

                    }).catch((e) => reject({message: e.message}));
                } else {
                    query(isOlder, data).then((res) => {
                        var resultJson = [];
                        resultJson[0] = JSON.stringify(res);
                        if (new Date(jsonParsed.lastUpdate) > new Date(resultJson[0])) {
                            const willRepalce = `UPDATE Snapshot SET data =?, lastUpdate=? WHERE url like ?`
                            query(willRepalce, [body, jsonParsed.lastUpdate, dataUrl]).then((res) => {

                            }).catch((e) => reject({message: e.message}));
                        }
                    }).catch((e) => reject({message: e.message}));
                }
            }).catch((e) => reject({message: e.message}));
        }).catch((e) => reject({message: e.message}));
    })
}


/**
 * used to check if someone tried to befriend us
 * Ask a certain snapshot
 *
 * no response value expected for this operation
 **/
exports.getMsgHistory = function () {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}


/**
 * used to ask data to others
 * Ask a certain snapshot
 *
 * no response value expected for this operation
 **/
exports.getFriendHistory = function () {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}

