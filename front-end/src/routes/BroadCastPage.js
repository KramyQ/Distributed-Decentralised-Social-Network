import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "../App.css";
import { getReachableBroadcast } from "../services/messages";
import { makeStyles } from '@material-ui/core/styles';
import { getListFriend } from "../services/friend";
import FormDialog from "../components/formComponent";
import Post from "../components/postComponent";

const FeedPage = () => {
    const [postMessages, setMessages] = useState([]);
    useEffect(() => {
        getReachableBroadcast(3).then((res) => {
            let postsLocal = []
            res.forEach(data => {
                postsLocal.push(data)
            })
            setMessages(postsLocal)
        })
        getListFriend().then((res) => {
            res.forEach(data => {
                console.log(data.url)
            })
        })
    }, []);

    const useStyles = makeStyles((theme) => ({
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }));

    const classes = useStyles();

    return (
        <div className={classes.content}>
            <h1>Diffusion de messages Broadcast</h1>
            <FormDialog></FormDialog>
            <Grid container justify="center">
                <Grid item xs={12} sm={12} md={8} lg={6} xl={6}>
                    {postMessages.map((post) => {
                        return (
                            <Post post={post}></Post>
                        )
                    })}
                </Grid>
            </Grid>

        </div>
    );
};

export default FeedPage;
