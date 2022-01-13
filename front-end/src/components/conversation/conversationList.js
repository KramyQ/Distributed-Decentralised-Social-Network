import { Grid } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import React, { useState, useEffect } from "react";
import UserDisplay from "../userDisplayComponent";
import { getListFriend } from "services/friend";
import { makeStyles } from '@material-ui/core/styles';


export default function ConversationList({ selectedFriend, setSelectedFriend }) {
    const [friendList, setFriendList] = useState([]);

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(1),
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        let mounted = true;
        getListFriend().then((items) => {
            if (mounted) {
                setFriendList(items);
            }
        });
        return () => (mounted = false);
    }, []);

    function selectFriend(friend) {
        if (selectedFriend.url === friend.url) {
            setSelectedFriend(false);
        }
        setSelectedFriend(friend);
    }

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="strech"
            spacing={2}
            className={classes.root}
        >
            <h2>Conversations</h2>
            {friendList.map((friend) => {
                if (friend.statut === "friend" && friend.me !== 1) {
                    return (
                        <Grid key={"friend-id:" + friend.id} item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card>
                                <CardActionArea onClick={() => selectFriend(friend)}>
                                    <CardContent>
                                        <UserDisplay name={friend.name}></UserDisplay>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                } else {
                    return null;
                }
            })}
        </Grid>
    );

}
