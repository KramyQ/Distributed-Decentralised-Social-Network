"use strict";
const query = require("../db/db-connection");
const request = require('request');

/**
 * Create a new post
 *
 * body Posts Post to create
 * returns String
 **/
exports.createNewPost = function (body) {
  return new Promise(function (resolve, reject) {
    const jsonParsed = JSON.parse(body);
    // There is no author id in the body => that's this node's user that created the post
    if (!jsonParsed.authorUrl) {
      reject({ message: "no author" });
    }
    const sqlCheckThatTheUserIsAFriend =
      "SELECT * FROM Friends WHERE url like ?";
    const data = ["%" + jsonParsed.authorUrl + "%"];
    query(sqlCheckThatTheUserIsAFriend, data).then((res) => {
      if (res.length <= 0) {
        reject({ message: "the author is not a friend" });
      }
      const author = res[0];
      const sqlInsertNewPost = `INSERT INTO Post (date, content, author_id, statut) values (?,?,?,?)`;
      const data = [
        jsonParsed.date
          ? jsonParsed.date
          : new Date().toISOString().slice(0, 19).replace("T", " "),
        jsonParsed.content,
        author.id,
        jsonParsed.statut,
      ];
      query(sqlInsertNewPost, data)
        .then((res) => {
          resolve({
            date: jsonParsed.date,
            content: jsonParsed.content,
            author: author,
            statut: jsonParsed.statut,
          });
        })
        .catch((e) => reject({ message: e.message }));
    });
  });
};

/**
 * Get posts from friend
 * Get posts from friend
 *
 * status User Status values that need to be considered for filter
 * returns List
 **/
exports.getAllPosts = function (status) {
  return new Promise(function (resolve, reject) {
    const sqlGetAllPosts =
      "SELECT Post.id, date, content, author_id, name, url, connected, Friends.statut FROM Post JOIN Friends on author_id=Friends.id";
    query(sqlGetAllPosts)
      .then((res) => {
        var resultJson = [];
        // resultJson[0] = JSON.stringify(res);
        resultJson[0] = res;
        if (Object.keys(resultJson).length > 0) {
          const resultArray = resultJson[Object.keys(resultJson)[0]];
          resultArray.map((result) => {
            result.author = {
              name: result.name,
              id: result.author_id,
              url: result.url,
            };
            delete result["name"];
            delete result["author_id"];
            delete result["url"];
          });
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
 * Get the feed of someone
 * Feed getter
 *
 * visited List Sites that have already been visited
 * origin String origin of the request
 * returns List
 **/
exports.getFeed = function(visited,origin) {
  return new Promise(function(resolve, reject) {
      console.log('salut')
      const listVisited = visited[0].split(',')
      //Get all local messages
      let localUrl = '';
      let sql = `SELECT * FROM Friends where me = 1`;
      query(sql).then((res) => {
          visited.push(res[0].url)
          listVisited.push(res[0].url)
          sql = `SELECT * FROM Friends where url = ?`;
          let allPosts = [];
          let data = []
          query(sql,[origin]).then((res) =>{

              if(res.length == 0) sql = `SELECT Post.id, date, content, author_id, name, url, connected, Friends.statut FROM Post JOIN Friends on author_id=Friends.id where Friends.me = 1 and Post.statut = "public"`
              else sql = `SELECT Post.id, date, content, author_id, name, url, connected, Friends.statut FROM Post JOIN Friends on author_id=Friends.id where Friends.me = 1`
              query(sql, data).then( async (res) =>{
                  // Get all local posts
                  res.forEach(post => {
                      allPosts.push({
                          date: post.date,
                          author: {
                              name: post.name,
                              id: post.author_id,
                              url: post.url,
                          },
                          id: post.id,
                          content: post.content
                      })
                  })

                  sql = `SELECT * FROM Friends where me = 0`
                  query(sql).then( async (friendsRes) => {
                      allPosts = await eachFriend(friendsRes,listVisited,visited,allPosts,origin)
                      resolve(allPosts);
                  })
                  //ADD to list
              })
              // For each friend
          })
      })


  });
}

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            let postResult = [];
            if (res && res.statusCode == 200){
                let posts = JSON.parse(res.body)
                posts.forEach(post =>{
                    postResult.push({
                        date: post.date,
                        author: {
                            name: post.author.name,
                            id: post.author.author_id,
                            url: post.author.url,
                        },
                        id: post.id,
                        content: post.content
                    })
                })
            }
            else{
                //TODO SNAPSHOT
                console.log('Ami déconnecté')
            }
            resolve(postResult)
        });
    });
}

function eachFriend(friendsRes,listVisited,visited,allPosts,origin) {
    return new Promise(async function (resolve, reject) {
        for (let index = 0; index < friendsRes.length; index++) {
            if (!listVisited.includes(friendsRes[index].url)) {
                var propertiesObject = {origin: encodeURI(origin), visited: encodeURI(visited)};
                // TODO fix the ERRCONNECT RAISED BY TRYNG TO CONNECT TWO NODES
                console.log('request sur '+friendsRes[index].url)
                let posts = await doRequest({url: friendsRes[index].url_backend + 'getFeed', qs: propertiesObject})
                for (let i =0 ; i<posts.length;i++){
                    if (!listVisited.includes(posts[i].author.url)) {
                        listVisited.push(posts[i].author.url)
                        visited.push(posts[i].author.url)
                    }
                }
                console.log("message recu")
                console.log(posts)
                allPosts= allPosts.concat(posts)
            } else console.log('deja visite :'+friendsRes[index].url)
        }
        resolve(allPosts)
    });
}

/**
 * Get the public posts of someone
 * public posts getter
 *
 * origin String origin of the request
 * returns List
 **/
 exports.getPostsPublic = function(origin) {
  return new Promise(function(resolve, reject) {
    console.log('post public test')
        let sql = `SELECT * FROM Friends where url = ?`;
        let allPosts = [];
        let data = [];
        query(sql,[origin]).then((res) =>{
            if(res.length == 0) sql = `SELECT Post.id, date, content, author_id, name, url, connected, Friends.statut FROM Post JOIN Friends on author_id=Friends.id where Friends.me = 1 and Post.statut = "public"`
            else sql = `SELECT Post.id, date, content, author_id, name, url, connected, Friends.statut FROM Post JOIN Friends on author_id=Friends.id where Friends.me = 1`
            query(sql, data).then( async (res) =>{
                // Get all local posts
                res.forEach(post => {
                    allPosts.push({
                        date: post.date,
                        author: {
                            name: post.name,
                            id: post.author_id,
                            url: post.url,
                        },
                        id: post.id,
                        content: post.content
                    })
                })
            })
    })
});
}
