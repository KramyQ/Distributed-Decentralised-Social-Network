import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React from "react";
import "../App.css";
import UserDisplay from "./userDisplayComponent";



const Post = ({ post }) => {
    return (
        <Card key={"post-id:" + post.id} style={{ marginBottom: "10px" }}>
            <CardContent>
                <UserDisplay name={post.author.name} date={post.date}></UserDisplay>
                <Typography variant="h5">
                    {post.content}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Post;
