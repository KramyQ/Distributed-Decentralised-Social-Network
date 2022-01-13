'use strict';
const query = require('../db/db-connection');
const request = require('request');



/**
 * Treat this message
 *
 * body Message message to process
 * no response value expected for this operation
 **/
exports.receiveMessage = function (body) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}



exports.privateMessagesofUserGET = function(url) {
    return new Promise(function(resolve, reject) {

        let sql = `SELECT * FROM Messages where (url_target=? or url_sender=?) and type="private" `;

        let data=[url,url];
        query(sql,data).then((res) => {
            var resultJson = [];

            resultJson[0] = JSON.stringify(res);
            console.log(resultJson);
            if (Object.keys(resultJson).length > 0) {
                resolve(resultJson[Object.keys(resultJson)[0]]);
            } else {
                resolve();
            }

        });

    });
}

exports.publicMessagesofUserGET = function() {
    return new Promise(function(resolve, reject) {

        const sqlGetAllPublic =
            "SELECT content,Friends.name FROM Messages JOIN Friends on Messages.url_sender=Friends.url WHERE Friends.me=1 AND Messages.type='broadcast'";

        query(sqlGetAllPublic)
            .then((res) => {
                console.log(res+"publicMessagesofUserGet")
                var resultJson = [];
                resultJson[0] = JSON.stringify(res);
                if (Object.keys(resultJson).length > 0) {
                    resolve(resultJson[Object.keys(resultJson)[0]]);
                } else {
                    resolve();
                }
            })
            .catch((e) => {
                console.log("erreur: " + e.message);
            });
    });

};






/**
 * Treat this message
 *
 * body Message message to process
 * no response value expected for this operation
 **/
exports.receiveMessagePOST = function(body) {

    return new Promise(function(resolve, reject) {

        const jsonParse = JSON.parse(body);
        let sql = `INSERT into Messages (type,content,url_sender,url_target) VALUES (?,?,?,?)`;
        let data = [jsonParse.messageType,jsonParse.content,jsonParse.url_me,jsonParse.url_target];
        query(sql,data).then((res) => {

            console.log("message added");
        }).catch((res)=>{
            reject();
            throw err;
        });
        resolve();
    });
}



/**
 * add a new message to your friend
 *
 * no response value expected for this operation
 **/
exports.sendMessagePOST = function() {
    return new Promise(function(resolve, reject) {
        const jsonParse = JSON.parse(body);
        let sql = `INSERT into Messages (type,content,url_sender,url_target) VALUES (?,?,?,?)`;
        let data = [jsonParse.messageType,jsonParse.content,jsonParse.url_me,jsonParse.url_target];
        query(sql,data).then((res) => {
            console.log("message added");
        }).catch((res)=>{
            reject();
            throw err;
        });
        resolve();
    });
}

/**
 * add a new message to everyone
 *
 * no response value expected for this operation
 **/
exports.sendPublicMessagePOST = function(visited,origin,bouns) {
    return new Promise(function(resolve, reject) {
        console.log(bouns)
        bouns -= 1
        console.log(visited+"visited");
        const listVisited=visited[0].split(',');
        let sql = `SELECT * FROM Friends where me = 1`;
        query(sql).then((res) => {
            console.log("select * friend+"+res);
            visited.push(res[0].url)

            listVisited.push(res[0].url)

            sql = `SELECT * FROM Friends where url = ?`;
            let allMessages = [];
            let data = []
            query(sql,[origin]).then((res) =>{
                console.log(res+" On est là dans ces propres messages ")

                sql = `SELECT content,  Friends.name, url_sender, Friends.connected, Friends.statut FROM Messages JOIN Friends on Messages.url_sender=Friends.url where Friends.me = 1 and Messages.type = "broadcast"`
                console.log(origin);
                query(sql, data).then( async (res) =>{
                    // Get all local posts
                    res.forEach(message => {
                        allMessages.push({
                            author: {
                                name: message.name,
                                url: message.url,
                            },
                            //id: post.id,
                            content: message.content
                        })
                    })
                    sql = `SELECT * FROM Friends where me = 0`;
                    query(sql).then( async (friendsRes) => {
                        if(bouns != 0){
                            allMessages = await eachFriend(friendsRes,listVisited,visited,allMessages,origin,bouns)
                            console.log('Fin messages')
                            console.log(allMessages)
                        }
                        resolve(allMessages);
                    })
                    //ADD to list
                })
                // For each friend
            })






        });
    })
}
function doRequest(url) {
    return new Promise(function (resolve, reject) {
        console.log(url)
        request(url, function (error, res, body) {
            let postMessages = [];
            if (res && res.statusCode == 200){
                let posts = JSON.parse(res.body)
                console.log(posts);
                posts.forEach(message =>{
                    console.log(message)
                    postMessages.push({
                        author: {
                            name: message.author.name,
                            url: message.author.url,
                        },
                        content: message.content
                    })
                })
            }else{
               console.log('Ami déconnecté'+error)
                console.log(res)
            }
            resolve(postMessages)

        });
    });
}




function eachFriend(friendsRes,listVisited,visited,allMessages,origin,bouns) {
    return new Promise(async function (resolve, reject) {
        origin=encodeURI(origin);
        for (let index = 0; index < friendsRes.length; index++) {
            if (!listVisited.includes(friendsRes[index].url)) {
                var propertiesObject = {visited: encodeURI(visited),origin: encodeURIComponent(origin),bouns};
                // TODO fix the ERRCONNECT RAISED BY TRYNG TO CONNECT TWO NODES
                console.log('request sur '+friendsRes[index].url)
                let messages = await doRequest({url: friendsRes[index].url_backend + 'getAllPublicMessages', qs: propertiesObject})
                console.log(propertiesObject);
                console.log("MESSAGE RECU")
                console.log(messages)
                for (let i =0 ; i<messages.length;i++){
                    if (!listVisited.includes(messages[i].author.url)) {
                        listVisited.push(messages[i].author.url)
                        visited.push(messages[i].author.url)
                    }
                }
                allMessages= allMessages.concat(messages)
                //console.log("yes allMessages done");
            } else console.log('deja visite :'+friendsRes[index].url)
        }
        resolve(allMessages)
    });
}


