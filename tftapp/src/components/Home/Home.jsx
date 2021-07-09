import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import volibear from "../../images/volibear.jpg";
import style from "./Home.module.scss";

const CustomTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      padding: "50px",
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);
const useStyles = makeStyles((theme) => ({
  divider: {
    height: 28,
    margin: 4,
  },
  backgroundImage: {
    width: "100vw",
    backgroundImage: `url(${volibear})`,
    height: "100vh",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    position: "fixed",

    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    maxWidth: "700px",
    width: "100%",
    padding: "2px 15px",
    zIndex: "12",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  container: {
    zIndex: 5,
    marginTop: "48px",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
}));
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
  typography: {
    fontFamily: ["Roboto Condensed"].join(","),
  },
});
const Home = (props) => {
  const [text, setText] = useState("");
  const classes = useStyles();

  const handleInput = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.history.push(`/match-history/${text}`);
  };
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Box
          image={volibear}
          bgcolor="primary.main"
          className={classes.backgroundImage}
        >
          <Container className={classes.container}>
            <Paper
              onSubmit={handleSubmit}
              className={classes.root}
              component="form"
            >
              <CustomTextField
                onChange={handleInput}
                InputProps={{
                  "aria-label": "description",
                  disableUnderline: true,
                }}
                placeholder="Enter your username"
              />

              <IconButton type="submit" aria-label="search">
                <Divider className={classes.divider} orientation="vertical" />
                <SearchIcon />
              </IconButton>
            </Paper>
          </Container>{" "}
          <Box className={classes.backdrop}></Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
