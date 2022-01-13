import { Grid, TextField } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import React, { useEffect, useState } from "react";
import "../App.css";
import PageDialog from "../components/layouts/FullScreenDialog";
import { askFriend, deleteFriend, getListFriend } from "../services/friend";
import UserDisplay from "../components/userDisplayComponent";



const MyFriends = () => {
  const [listFriend, setListFriend] = useState([]);
  const [auth, setAuth] = useState(false);
  const [errMessage, setErrMessage] = useState('')
  const [valideMessage, setValideMessage] = useState('')
  const [askedFriend, setAskedFriend] = useState('')


  const useStyles = makeStyles((theme) => ({
    root: {
      margin: theme.spacing(2),
    },
    friends: {
      display: 'inLine'
    }
  }));


  //Update the friend list
  function updateFriends() {
    let mounted = true;
    getListFriend().then((items) => {
      if (mounted) {
        setListFriend(items);
      }
    });
    return () => (mounted = false);
  }

  //Update the button
  function checkImAwake(event) {
    listFriend.forEach((value) => {
      if (value.url.includes(":" + process.env.REACT_APP_API)) {
        if (value.connected === 1) {
          // setTextButton("Apparaitre hors ligne");
          setAuth(event.target.checked);
        }
      }
    });
  }

  //Update the app information every 1 sec
  useEffect(() => {
    const interval = setInterval(() => {
      updateFriends();
      checkImAwake();
    }, 1000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    updateFriends();
  }, []);

  //Handle friend requests
  async function askToFriend(urlParam) {
    if (!urlParam) {
      urlParam = askedFriend;
    }
    let myName = "";
    listFriend.forEach((value) => {
      if (value.me === 1) {
        myName = value.name;
      }
    });
    let error = await askFriend('http://localhost:' + urlParam, myName);
    setErrMessage(error)
  }

  async function delFriend(urlParam) {
    let myName = "";
    listFriend.forEach((value) => {
      if (value.me === 1) {
        myName = value.name;
      }
    });
    let error = await deleteFriend('http://localhost:' + urlParam, myName);
    setErrMessage(error)
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Mes amis</h1>
      <Grid container spacing={2}>
        {listFriend.map((friend) => {
          if (friend.statut === "friend") {
            let name = friend.name;
            if (friend.url.includes(":" + process.env.REACT_APP_API)) {
              return null;
            } else {
              let StyledBadge = withStyles((theme) => ({
                badge: {
                  backgroundColor: '#44b700',
                  color: '#44b700',
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  '&::after': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: '$ripple 1.2s infinite ease-in-out',
                    border: '1px solid currentColor',
                    content: '""',
                  },
                },
                '@keyframes ripple': {
                  '0%': {
                    transform: 'scale(.8)',
                    opacity: 1,
                  },
                  '100%': {
                    transform: 'scale(2.4)',
                    opacity: 0,
                  },
                },
              }))(Badge);
              if(friend.connected == 0){
                StyledBadge = withStyles((theme) => ({
                  badge: {
                    backgroundColor: 'red',
                    color: 'red',
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                    '&::after': {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      animation: '$ripple 1.2s infinite ease-in-out',
                      border: '1px solid currentColor',
                      content: '""',
                    },
                  },
                  '@keyframes ripple': {
                    '0%': {
                      transform: 'scale(.8)',
                      opacity: 1,
                    },
                    '100%': {
                      transform: 'scale(2.4)',
                      opacity: 0,
                    },
                  },
                }))(Badge);
              }
              return (
                <Grid key={"friend-id:" + friend.id} item xs={12} sm={6} md={5} lg={4} xl={3} style={{ marginBottom: "10px" }}>
                  <Card>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <StyledBadge
                            overlap="circle"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            variant="dot"
                          >
                            <Avatar className={classes.orange}>{name[0]}</Avatar>
                          </StyledBadge>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6">
                            {name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions className="flex-start">
                      <PageDialog urlTarget={friend.url} name={friend.name} />
                      <Button
                        color="secondary"
                        className={classes.button}
                        startIcon={<DeleteIcon />}
                        onClick={() => delFriend(friend.url.split(':')[2])}
                        value={friend.url}
                      >
                        Supprimer
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            }
          } else {
            return null;
          }
        })}
      </Grid>
      <p style={{ color: "red" }}>{errMessage}</p>
      <p style={{ color: "green" }}>{valideMessage}</p>
      <h1>Ajouter un ami</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Card>
            <CardContent>
              <TextField
                label="Port de votre ami"
                variant="outlined"
                onChange={(e) => setAskedFriend(e.target.value)}
                fullWidth
              />
            </CardContent>
            <CardActions>
              <Button
                onClick={() => askToFriend()}
                startIcon={<PersonAddIcon />}
                variant="contained"
                color="primary"
              >
                Ajouter
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <h1>Demandes d'ami en attente</h1>
      {listFriend.map((friend) => {
        if (friend.statut === "pending") {
          return (
            <Grid key={"friend-id:" + friend.id} item xs={12} sm={6} md={5} lg={4} xl={3} style={{ marginBottom: "10px" }}>
              <Card>
                <CardContent>
                  <UserDisplay name={friend.name}></UserDisplay>
                </CardContent>
                <CardActions className="flex-start">
                  <PageDialog urlTarget={friend.url} name={friend.name} />
                </CardActions>
              </Card>
            </Grid>
          )
        } else {
          return null;
        }
      })}
      <h1>Demandes reçues</h1>
      {listFriend.map((friend) => {
        if (friend.statut === "waiting") {
          return (
            <Grid key={"friend-id:" + friend.id} item xs={12} sm={6} md={5} lg={4} xl={3} style={{ marginBottom: "10px" }}>
              <Card>
                <CardContent>
                  <UserDisplay name={friend.name}></UserDisplay>
                </CardContent>
                <CardActions className="flex-start">
                  <PageDialog urlTarget={friend.url} name={friend.name} />
                  <Button
                    onClick={() => askToFriend(friend.url.split(':')[2])}
                    variant="contained"
                    color="primary"
                    startIcon={<CheckIcon />}
                  >
                    Accepter
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default MyFriends;
