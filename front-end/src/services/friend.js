//TODO => move it on top of the services + port should be editable on start of the app

import { apiPort, apiValue, apiPath } from "../utils/constants";
import * as url from "url";

export function getListFriend() {
  return fetch(apiValue + "friends").then((data) => data.json());
}

export function getMe() {
  return fetch(apiValue + "me").then((data) => data.json());
}

export function notifyOnLine(urlFriend) {
  console.log(urlFriend)
  fetch(urlFriend + "notify?from=" + apiPort + "&action=login").then(
      (res) => {}
  );
}

export function notifyOffline(urlFriend) {
  fetch(
      urlFriend + "notify?from=" + process.env.REACT_APP_API + "&action=logout"
  ).then((res) => console.log(res));
}

export async function askFriend(url, myName) {
  //Make a request to an outside user
  let urlFormatedDest = url;
  if (!url.includes(apiPath)) {
    urlFormatedDest = url + apiPath;
  }
  const urlFormatedMe = apiValue;
  let data = { name: myName, url: urlFormatedMe };
  return await fetch(urlFormatedDest + "friends?situation=out", {
    method: "post",
    body: JSON.stringify(data),
  })
    .then((res) => {
      //Make the request on our back-end with the retrieve name
      if (res.ok) {
        res.json().then((json) => {
          data = { name: json.name, url: urlFormatedDest };
          fetch(apiValue + "friends?situation=in", {
            method: "post",
            body: JSON.stringify(data),
          }).then((res) => {});
        });
      }
    })
    .catch((e) => {
      return "Impossible, votre ami est déconnecté";
    });
}

export async function deleteFriend(url, myName) {
  //Make a request to an outside user
  let urlFormatedDest = url;
  if (!url.includes(apiPath)) {
    urlFormatedDest = url + apiPath;
  }
  const urlFormatedMe = apiValue;
  let data = {name: myName, url: urlFormatedMe};
  console.log('delete'+urlFormatedDest)
  return await fetch(urlFormatedDest + "friends?situation=delete", {
    method: "post",
    body: JSON.stringify(data),
  }).then((res) => {
    //Make the request on our back-end with the retrieve name
    if (res.ok) {
      res.json().then((json) => {
        data = {name: json.name, url: urlFormatedDest};
        fetch(apiValue + "friends?situation=delete", {
          method: "post",
          body: JSON.stringify(data),
        }).then((res) => {
        });
      });
    }
  }).catch((e) => {
    return "Impossible, votre ami est déconnecté"
  });
}
