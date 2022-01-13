import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../App.css";
import Post from "../components/postComponent";
import { getListFriend } from "../services/friend";
import { getLocalPosts } from "../services/posts";

const FeedPage = () => {
    const [postFeed, setFeed] = useState([]);
    useEffect(() => {
        getLocalPosts().then((res) => {
            let postsLocal = []
            res.forEach(data => {
                postsLocal.push(data)
            })
            setFeed(postsLocal)
        })
        getListFriend().then((res) => {
            res.forEach(data => {
            })
        })
    }, []);

    return (
        <div>
            <Grid container justify="center">
                <Grid item xs={12} sm={12} md={8} lg={6} xl={6}>

                    {postFeed && postFeed.length > 0 ?
                        <h1>Fil d'actualité</h1>
                        :
                        null
                    }
                    {postFeed.map((post) => {
                        return (
                            <Post post={post}></Post>
                        );
                    })}
                </Grid>
            </Grid>
        </div>
    );
};

export default FeedPage;
