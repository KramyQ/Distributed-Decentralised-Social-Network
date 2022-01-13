
import {apiPort, apiValue,apiPath} from "../utils/constants";

export  function  insertMessage(urlFriend,message) {
    let data = {messageType:'private',content:message,

        url_me: apiValue,

        url_target: urlFriend

    }
    fetch(apiValue+'receiveMessage',{
        method: 'post', body: JSON.stringify(data)
    })
        .then(res=>{

        }).catch((res)=>{


    })
}
export  function  insertBroadcastMessage(message) {
    let data = {messageType:'broadcast',content:message,

        url_me: apiValue,

        url_target: apiValue

    }
    fetch(apiValue+'receiveMessage',{
        method: 'post', body: JSON.stringify(data)
    })
        .then(res=>{

        }).catch((res)=>{


    })
}




export  function  insertMessageToTarget(urlFriend,message) {
    let data = {messageType:'private',content:message,

        url_me: apiValue,

        url_target: urlFriend

    }
    fetch(urlFriend+'receiveMessage',{
        method: 'post', body: JSON.stringify(data)
    })
        .then(res=>{;

        }).catch((res)=>{


    })
}



export function retrieveMessage(urlFriend){
    return  fetch(apiValue+'privateMessages?url='+encodeURIComponent(urlFriend))
        .then(res => {

            return   (res.json())

        })
}


export function getReachableBroadcast(nb){
     return fetch(apiValue + 'getAllPublicMessages?'+new URLSearchParams({
         origin: encodeURI(apiValue),
         visited: encodeURIComponent(["localhost"]),
         bouns: nb,
     })).then((data) => data.json());
 }
