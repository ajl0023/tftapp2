import { Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.secondary.main,
  },
}));

const Navbar = () => {
  const history = useHistory();
  const navHome = () => {
    history.push("/");
  };
  const classes = useStyles();
  useEffect(() => {}, []);

  return (
    <div>
      <AppBar className={classes.container} position="fixed">
        <Tabs value={0}>
          <Tab onClick={navHome} icon={<HomeIcon />} />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default Navbar;
