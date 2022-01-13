import React, { useState } from "react";
import { Tabs, Tab } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import NetworkWifiIcon from '@material-ui/icons/NetworkWifi';
import ChatIcon from "@material-ui/icons/Chat";
import {
  MY_FRIENDS_URL,
  HOME_PAGE_URL,
  FEED_PAGE,
  MY_PROFILE_URL,
  MY_BRODCAST_URL,
} from "utils/constants";
import { useHistory } from "react-router-dom";
import { RssFeed } from "@material-ui/icons";
import AccountCircle from "@material-ui/icons/AccountCircle";

export default () => {
  let history = useHistory();
  const [selectedTabValue, setSelectedTabValue] = useState(0);

  const handleSelectedTabValueChange = (index) => {
    setSelectedTabValue(index);
  };

  return (
    <Tabs
      value={selectedTabValue}
      variant="fullWidth"
      aria-label="simple tabs example"
      indicatorColor="primary"
      centered
      selectionFollowsFocus
    >
      <Tab
        label="Mon mur"
        icon={<HomeIcon />}
        onClick={() => {
          handleSelectedTabValueChange(0);
          history.push(HOME_PAGE_URL);
        }}
      />
      <Tab
        label="Fil d'actualité"
        icon={<RssFeed />}
        onClick={() => {
          handleSelectedTabValueChange(1);
          history.push(FEED_PAGE);
        }}
      />
      <Tab
        label="Mes amis"
        icon={<PeopleAltIcon />}
        onClick={() => {
          handleSelectedTabValueChange(2);
          history.push(MY_FRIENDS_URL);
        }}
      />
      <Tab
        label="Mon profil"
        icon={<AccountCircle />}
        onClick={() => {
          history.push(MY_PROFILE_URL);
          handleSelectedTabValueChange(3);
        }}
      />
        <Tab
        label="broadcast"
        icon={<NetworkWifiIcon />}
        onClick={() => {
          handleSelectedTabValueChange(4);
          history.push(MY_BRODCAST_URL);
        }}
      />

    </Tabs>
    



  );
};
