"use strict";
const query = require("../db/db-connection");
const fetch = require("node-fetch");
const isReachable = require('is-reachable');
const https = require("request");

const DICTIONNARY_BACK = {
    "8000": "first",
    "8001": "second",
    "8002": "third",
    "8003": "fourth",
    "8004": "fifth"
}

const API_VALUE = "/Sr05-Project/Distributed_Facebook_API/1.0.0/"


/**
 * Target by the local react on start
 * Ask if friends are available and ask for the snapshot
 *
 * no response value expected for this operation
 **/


exports.init = function () {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM Friends`;
        query(sql).then((res) => {
            for (let item in res) {
                console.log(res[item]);
                let sql = `UPDATE friends set connected = 0 where id =` + res[item].id;
                console.log(
                    "https://" +
                    res[item].url +
                    "Sr05-Project/Distributed_Facebook_API/1.0.0/notifyConnection"
                );
                try {
                    https.get(
                        "https://" +
                        res[item].url +
                        "Sr05-Project/Distributed_Facebook_API/1.0.0/notifyConnection",
                        function (res) {
                            console.log("statusCode: ", res.statusCode);
                            if (res.statusCode == 200) {
                                sql =
                                    `UPDATE friends set connected = 1 where id =` + res[item].id;
                            } // <======= Here's the status code      );
                        })
                } catch (e) {
                }
                query(sql).then((res) => {
                });
            }
                resolve();
        });



        //Get myself in the friends databse
        let findMyself = `SELECT * FROM Friends where url like ?`;
        let data = ["%:" + process.env.NODE_PORT + "%"];
        let user = {};
        query(findMyself, data).then((res) => {
            //Return our name in order for the origin to be able to insert us
            if (res.length > 0) {
                user["name"] = res[0].name;
                user['url'] = res[0].url;
            }
            const checkIfSnapshot = `SELECT * FROM Snapshot where url like ?`;
            // Initialisation de son propre snapshot à la connexion :
            //On récupère ses amis hormis nous même, on récupère ses posts :

            const getAllFriends = `SELECT * FROM Friends where me=0`;
            let friends = []
            let posts = []
            query(getAllFriends).then((res) => {
                var resultJson = [];
                resultJson[0] = JSON.stringify(res);
                friends = resultJson[0]
                const getAllPosts = `SELECT * FROM Post`;
                query(getAllPosts).then((res) => {
                    var resultJson = [];
                    resultJson[0] = JSON.stringify(res);
                    posts = resultJson[0]
                    let snapShotData = JSON.stringify({friends: friends, posts: posts})

                    query(checkIfSnapshot, [user['url']]).then((res) => {
                        let sqlInsertNewSnapshot
                        if (res.length > 0) { // Le snapshot existe déjà on l'altère sinon on le créer:
                            sqlInsertNewSnapshot = `UPDATE Snapshot SET data =?, lastUpdate=? WHERE url like ?`;
                            resolve()
                        } else {
                            sqlInsertNewSnapshot = `INSERT INTO Snapshot (data, lastUpdate, url) values (?,?,?)`;
                            resolve()
                        }
                        query(sqlInsertNewSnapshot, [snapShotData, new Date().toISOString().slice(0, 19).replace("T", " "), user['url']]).then((res) => {
                        })
                    })
                })
            })
            let sql = `SELECT * FROM Friends where me=0`;
            console.log("attempting to Fetch all states from connected friends")
            query(sql).then((res1) => {
                    let formerRes = res1
                    for (let item in formerRes) {
                        let backend_value = DICTIONNARY_BACK[formerRes[item].url.split(":")[2].split('/')[0]]
                        const checkIfSnapshot = `SELECT * FROM Snapshot where url like ?`;
                        (async () => {
                            if (await isReachable("http://" + backend_value + "_server_1:8000" + API_VALUE + "snapshot?url=" + encodeURIComponent(formerRes[item].url))) {
                                console.log("Worker")
                                fetch("http://" + backend_value + "_server_1:8000" + API_VALUE + "snapshot?url=" + encodeURIComponent(formerRes[item].url)).then(res2 => res2.json()
                                ).then(json => {
                                    query(checkIfSnapshot, [formerRes[item].url]).then((res3) => {
                                        if (res3.length > 0) { // Le snapshot existe déjà on l'altère sinon on le créer:
                                            let sqlInsertNewSnapshot = `update Snapshot set data =?, lastUpdate=? where url like ?`
                                            let params = [json[0].data, new Date().toISOString().slice(0, 19).replace("T", " "), formerRes[item].url]
                                            query(sqlInsertNewSnapshot, params).then((res4) => {
                                                console.log("altered")
                                            }).catch((e) => console.log({message: e.message}));
                                        } else {
                                            let sqlInsertNewSnapshot = `insert into Snapshot (data, url, lastUpdate) values (?,?,?)`
                                            let params = [json[0].data, formerRes[item].url, new Date().toISOString().slice(0, 19).replace("T", " ")]
                                            query(sqlInsertNewSnapshot, params).then((res4) => {
                                                console.log("Inserted")
                                            }).catch((e) => {
                                                console.log({message: e.message});
                                                reject({message: e.message})
                                            });
                                        }
                                    }).catch((e) => console.log({message: e.message}))
                                })
                            } else { // serveur pas connecté
                                console.log("serveur pas connecté ! bah ya une erreur on peut pas catch")
                                query(checkIfSnapshot, [formerRes[item].url]).then((res3) => {
                                    let friendsData = JSON.parse(JSON.parse(res3[0].data).friends)
                                    for (const friend of friendsData) {
                                        (async () => {
                                            let current_backend_value = DICTIONNARY_BACK[friend.url.split(":")[2].split('/')[0]]
                                            if (await isReachable("http://" + current_backend_value + "_server_1:8000" + API_VALUE + "snapshot?url=" + encodeURIComponent(formerRes[item].url)) && user['url'] != friend.url) {
                                                fetch("http://" + current_backend_value + "_server_1:8000" + API_VALUE + "snapshot?url=" + encodeURIComponent(formerRes[item].url)).then(res2 => res2.json()
                                                ).then(json => {
                                                    query(checkIfSnapshot, [formerRes[item].url]).then((res3) => {
                                                        if (res3.length > 0) { // Le snapshot existe déjà on l'altère sinon on le créer:
                                                            let sqlInsertNewSnapshot = `update Snapshot set data =?, lastUpdate=? where url like ?`
                                                            let params = [json[0].data, new Date().toISOString().slice(0, 19).replace("T", " "), formerRes[item].url]
                                                            query(sqlInsertNewSnapshot, params).then((res4) => {
                                                                console.log("altered")
                                                            }).catch((e) => console.log({message: e.message}));
                                                        } else {
                                                            let sqlInsertNewSnapshot = `insert into Snapshot (data, url, lastUpdate) values (?,?,?)`
                                                            let params = [json[0].data, formerRes[item].url, new Date().toISOString().slice(0, 19).replace("T", " ")]
                                                            query(sqlInsertNewSnapshot, params).then((res4) => {
                                                                console.log("Inserted")
                                                            }).catch((e) => {
                                                                console.log({message: e.message});
                                                                reject({message: e.message})
                                                            });
                                                        }
                                                    }).catch((e) => console.log({message: e.message}))
                                                })
                                            }
                                        })();
                                    }
                                }).catch((e) => console.log({message: e.message}))
                            }
                        })();
                    }
                }
            ).catch((e) => reject({message: e.message}));
        })
    });
};



