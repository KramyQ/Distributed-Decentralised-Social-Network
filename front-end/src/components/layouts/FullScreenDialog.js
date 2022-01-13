import { Grid, Tab, Tabs } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChatIcon from "@material-ui/icons/Chat";
import CloseIcon from '@material-ui/icons/Close';
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import PropTypes from 'prop-types';
import { getListFriendsFriend, getListPosts, getPublicPosts } from "../../services/pages";
import { getListFriend } from "../../services/friend";
import React, { useEffect, useState } from 'react';
import Post from "../postComponent";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PersonIcon from '@material-ui/icons/Person';
import UserDisplay from "../userDisplayComponent";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const { urlTarget } = props
  const { name } = props
  const [open, setOpen] = React.useState(false);
  const[listFriend,setListFriend]=useState([]);
  const[listMyFriend,setListMyFriend]=useState([]);
  const[listPost,setListPost]=useState([]);
  const [selectedTabValue, setSelectedTabValue] = useState(0);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectedTabValueChange = (index) => {
    setSelectedTabValue(index);
  };

  //Update the friend list
  function updateMyFriends() {
    let mounted = true;
    getListFriend().then((items) => {
      if (mounted) {
        setListMyFriend(items);
      }
    });
    return () => (mounted = false);
  }

    //Update the friend list
    function updateFriends() {
        let mounted = true;
        getListFriendsFriend(urlTarget).then((items) => {
          console.log(items)
            if (mounted) {
                setListFriend(items);
            }
        });
        return () => (mounted = false);
    }

     //Update the post list
    function updatePosts() {
      let mounted = true;
      getListPosts(urlTarget).then((items) => {
          if (mounted) {
            setListPost(items);
          }
      });
      return () => (mounted = false);
    }

    //Update the post list
    function updatePublicPosts() {
      let mounted = true;
      getPublicPosts(urlTarget).then((items) => {
          if (mounted) {
            setListPost(items);
          }
      });
      return () => (mounted = false);
    }

//   // //Update the app information every 1 sec
//   useEffect(() => {
//     const interval = setInterval(() => {
//       updateFriends();
//   }, 3000);
//   return()=>clearInterval(interval);
// },[])

    useEffect(() => {
        updateMyFriends();
        updateFriends();
        // console.log(listFriend);
        // console.log(listMyFriend);
        // listMyFriend.forEach((item) => {
        //   console.log("dans forEach");
        //   if (item.url.includes(urlTarget)) {
        //       // if we are friends
        //       console.log("dans if we are friends");
              updatePosts();
          // } else {
          //     // if we don't know each other
          //     console.log("dans if we don't know each other");
          //     updatePublicPosts();
          // }
      // })
    }, []);

  const handleClickOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
      variant="outlined"
       color="primary"
       onClick={handleClickOpen}
       startIcon={<PersonIcon />}>
        Voir son profil
      </Button>
      <Dialog
        fullScreen open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Page de {name}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              retour
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {/* <ScrollDialog /> */}
          {/* <Divider /> */}
          <Tabs
            onChange={handleChange}
            value={selectedTabValue}
            variant="fullWidth"
            aria-label="simple tabs example"
            indicatorColor="primary"
            centered
            selectionFollowsFocus
          >
            <Tab
              label="Publications"
              icon={<ChatIcon />}
              onClick={() => {
                handleSelectedTabValueChange(0);
              }}
            />
            <Tab
              label="Amis"
              icon={<PeopleAltIcon />}
              onClick={() => {
                handleSelectedTabValueChange(1);
              }}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            {listPost.map((post) => {
              return (
                <Grid container justify="center">
                  <Grid item xs={12} sm={12} md={8} lg={6} xl={6}>
                    {listPost.map((post) => {
                      return (
                        <Post post={post}></Post>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })
            }
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container justify="center" spacing={2}>
              {listFriend.map((friend) => {
                if (friend.url === urlTarget) {
                  return null;
                }
                if (friend.statut === "friend") {
                  let name = friend.name;
                  if (friend.url.includes(":" + process.env.REACT_APP_API)) {
                    name += " (moi)";
                  }
                  return (
                    <Grid key={"friend-id:" + friend.id} item xs={12} sm={6} md={4} lg={2} xl={2} style={{ marginBottom: "10px" }}>
                      <Card>
                        <CardContent>
                          <UserDisplay name={name}></UserDisplay>
                        </CardContent>
                      </Card>
                      <FullScreenDialog urlTarget={friend.url} name={friend.name} />
                    </Grid>
                  );
                } else {
                  return null;
                }
              })
              }
            </Grid>
          </TabPanel>
        </List>
      </Dialog>
    </div>
  );
}
