import { Grid } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import React from "react";
import "../App.css";

const UserDisplay = ({ name, date }) => {
    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item>
                <Avatar>{name[0]}</Avatar>
            </Grid>
            <Grid item>
                <Typography variant="h6">
                    {name}
                </Typography>
                {date ?
                    <Typography color="textSecondary">
                        {(new Date(date)).toLocaleDateString()}
                    </Typography>
                    :
                    null
                }
            </Grid>
        </Grid>
    );
};

export default UserDisplay;
