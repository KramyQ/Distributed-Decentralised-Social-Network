import './conversation.css'
import React, { useState, useEffect } from 'react';
import { retrieveMessage } from '../../services/messages';

export function MessageList(props) {
    const { urlSend } = props;
    const { name } = props
    const [listMessage, setListMessage] = useState([]);
    //Update the friend list
    function updateMessages() {
        let mounted = true;
        retrieveMessage(urlSend)
            .then(items => {
                if (mounted) {
                    setListMessage(items)

                }

            })
        return () => mounted = false;
    }
    useEffect(() => {
        const interval = setInterval(() => {
            updateMessages();

        }, 5000);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    useEffect(() => {
        updateMessages();
    }, [])
    return (
        <>
            <div className="commentBox">
                <h1>{name} Conversation</h1>

                {listMessage.map((item, index) => {
                    if (item.url_sender.includes(':' + process.env.REACT_APP_API)) {
                        item.url_sender = "moi";


                    } else if (item.url_sender != 'moi') {
                        item.url_sender = name
                    }
                    return (
                        <Comment author={item.url_sender}  >
                            {item.content}
                        </Comment>
                    )
                }
                )}
            </div>
        </>
    );
};






class Comment extends React.Component {

    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <p className="actualComment"> : {this.props.children}</p>
            </div>
        );
    }
}
