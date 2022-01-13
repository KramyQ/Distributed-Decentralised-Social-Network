import {apiValue, GET_POSTS_ROUTE} from "../utils/constants";

export function getLocalPosts(){
    return fetch(apiValue + 'getFeed?'+new URLSearchParams({
        origin: encodeURI(apiValue),
        visited: encodeURIComponent(["localhost"]),
    })).then((data) => data.json());
}
