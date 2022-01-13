import { Grid } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import React, { useEffect, useState } from "react";
import { getMe } from "services/friend";

const MyProfile = ({ ...props }) => {
  const [name, setName] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    getMe()
      .then((data) => {
        console.log("data", data);
        const me = data[0];
        setName(me.name);
        setUrl(me.url);
      })
      .catch((e) => console.error(e.message));
  }, []);

  const useStyles = makeStyles((theme) => ({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
          <Card>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar className={classes.large}>
                    <PersonIcon className={classes.large} />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    <strong>Nom</strong> : {name}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Mon URL</strong> : {url}
                  </Typography>
                </Grid>
              </Grid>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default MyProfile;
