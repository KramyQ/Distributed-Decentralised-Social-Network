import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import { getListFriend } from "services/friend";
import {
  apiValue, GET_POSTS_ROUTE, PUBLISH_POST_ROUTE
} from "utils/constants";
import "../App.css";
import Post from "../components/postComponent";



const HomePage = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [postList, setPostList] = useState([]);
  const [listFriend, setListFriend] = useState([]);
  const [publicPost, setPublicPost] = useState(false);

  function updateFriends() {
    let mounted = true;
    getListFriend().then((items) => {
      if (mounted) {
        setListFriend([...items]);
      }
    });
    return () => (mounted = false);
  }

  const handlePublicSwitchState = (e) => {
    setPublicPost(e.target.checked);
  };

  const updatePosts = () => {
    listFriend.map((friend) => {
      if (friend.me) {
        fetch(friend.url + GET_POSTS_ROUTE)
          .then((res) => {
            res.json().then((myPostList) => {
              setPostList([...myPostList]);
            });
          })
          .catch((e) => {
            console.error(e.message);
          });
      }
    });
  };

  //Update the app information every 5 sec
  useEffect(() => {
    if (listFriend.length === 0) {
      return;
    }
    updatePosts();
  }, [listFriend]);

  useEffect(() => {
    updateFriends();
  }, []);

  const handlePublishPost = () => {
    if (inputValue === "" || !inputValue) {
      return;
    }
    const data = {
      content: inputValue,
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
      authorUrl: apiValue,
      statut: publicPost ? "public" : "private",
    };

    fetch(apiValue + PUBLISH_POST_ROUTE, {
      method: "post",
      body: JSON.stringify(data),
    })
      .then((response) => {
        // once the post is in database, we update postList
        updatePosts();
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };


  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Grid container justify="center">
          <Grid item xs={12} sm={12} md={8} lg={6} xl={6}>
            <Card>
              <CardContent>
                <TextField
                  multiline
                  onChange={handleInputChange}
                  variant="outlined"
                  rows={6}
                  label="Quoi de neuf ?"
                  fullWidth />
                <div>
                  Publication publique
                  <Switch
                    checked={publicPost}
                    onChange={handlePublicSwitchState}
                    color="primary"
                  />
                </div>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" onClick={handlePublishPost}>
                  Publier
                </Button>
              </CardActions>
            </Card>
            {postList && postList.length > 0 ?
              <h1>Mes publications</h1>
              :
              null
            }
            {postList.map((post) => {
              return (
                <Post post={post}></Post>
              );
            })}
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default HomePage;
