import {apiValue} from "../utils/constants";


export function getListFriendsFriend(urlFriend) {
    return fetch(urlFriend + "friends")
        .then(resp => {
            return fetch(urlFriend + "friends").then((data) => data.json());
        })
        .catch(err => {
            return fetch(apiValue + "snapshot?url=" + encodeURIComponent(urlFriend)).then(res2 => res2.json()
            ).then(json => JSON.parse(JSON.parse(json[0].data).friends))
        });
}

export function getListPosts(urlFriend) {
    return fetch(urlFriend + "friends")
        .then(resp => {
            return fetch(urlFriend + "posts").then((data) => data.json());
        })
        .catch(err => {
            return fetch(apiValue + "snapshot?url=" + encodeURIComponent(urlFriend)).then(res2 => res2.json()
            ).then(json => JSON.parse(JSON.parse(json[0].data).posts))
        });
}


export function getPublicPosts(urlFriend) {
    return fetch(urlFriend + 'getPostsPublic?' + new URLSearchParams({
        origin: encodeURI(urlFriend),
    })).then((data) => data.json());
}

