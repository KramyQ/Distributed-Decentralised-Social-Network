import React, { useState } from "react";
import HomePage from "./routes/HomePage";
import MyFriends from "./routes/MyFriends";
import MyProfile from "routes/MyProfile";
import "./App.css";
import TopBar from "./components/layouts/topBar";
import ItemBar from "./components/layouts/itemBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {
  BrowserRouter as Router, Redirect, Route,
  Switch as RouteSwitch
} from "react-router-dom";
import {
  getListFriend,
  notifyOffline,
  notifyOnLine
} from "services/friend";
import { FEED_PAGE, MY_FRIENDS_URL, MY_PROFILE_URL } from "./utils/constants";
import FeedPage from "./routes/FeedPage";
import BroadCastPage from "./routes/BroadCastPage";
import "./App.css";
import ConversationList from "./components/conversation/conversationList"
import { Grid } from "@material-ui/core";
import { MessageList } from "./components/conversation/conversationPopUp";


function App() {
  const [auth, setAuth] = React.useState(false);
  const [listFriend, setListFriend] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(false);

  function updateFriends() {
    let mounted = true;
    getListFriend().then((items) => {
      if (mounted) {
        setListFriend(items);
      }
    });
    return () => (mounted = false);
  }

  // Handle the click online / offline
  function handleConnection(event) {
    if (auth === false) {
      listFriend.forEach((value) => {
        notifyOnLine(value.url);
      });
      updateFriends();
      setAuth(event.target.checked);
    } else {
      listFriend.forEach((value) => {
        notifyOffline(value.url);
      });
      updateFriends();
      setAuth(event.target.checked);
    }
  }

  return (
    <Router>
      <div className="App">
        <FormControlLabel
          control={<Switch checked={auth} onClick={handleConnection} />}
          label={auth ? "En ligne" : "Hors ligne"}
        />
        <TopBar />
        <ItemBar />
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
            <RouteSwitch>
              <Route exact path="/" component={HomePage} />
              <Route path={MY_FRIENDS_URL} component={MyFriends} />
              <Route path={FEED_PAGE} component={FeedPage} />
              <Route path="/broadcast" component={BroadCastPage} />
              <Route path={MY_PROFILE_URL} component={MyProfile} />
              <Redirect to="/" />
            </RouteSwitch>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <ConversationList selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
          </Grid>
        </Grid>
        {selectedFriend ?
          <footer>
            <MessageList urlSend={selectedFriend.url} isOpen={true} name={selectedFriend.name} urlTarget={selectedFriend.url}></MessageList>
          </footer>
          :
          null
        }
      </div>
    </Router >
  );
}

export default App;
