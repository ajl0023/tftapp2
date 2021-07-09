import { CardContent, Grid, Tooltip } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./MatchHistory.module.scss";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "1200px",
    fontFamily: "Roboto Condensed",
  },
  divider: {
    background: "white",
    marginBottom: theme.spacing(1),
  },
  header: { color: "white", fontSize: "20px" },
  containerBox: {
    background: theme.palette.primary.main,
    minHeight: "100vh",
    padding: "20px",
    marginTop: "48px",
  },
  cardContainer: {
    rowGap: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 0,
  },

  card: {
    display: "flex",
    width: "100%",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 20px",

    "&:last-child": {
      paddingBottom: "10px",
    },
  },
  imageContainer: {},
  contentContainer: {
    display: "flex",
    gap: "5px",
    width: "100%",

    alignItems: "center",
    background: "rgba(255,255,255, 0.2)",
    color: "white",
  },
  starLevel: {
    maxWidth: "15px",
  },
  heimerImage: {
    width: "80%",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    left: "50%",
    right: 0,
  },
  heimerContainer: {
    borderRadius: "50%",
    background: "white",
    width: "40px",
    height: "40px",
    position: "relative",
    padding: "8px",
  },
  champContainer: {
    display: "flex",

    alignItems: "center",
    flexDirection: "column",
  },
}));
const MatchHistory = (props) => {
  const classes = useStyles();
  const [matches, setMatches] = useState([]);

  const theme = useTheme();

  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `/api/match-history/${props.params.params.username}`
      );

      for (let match of data.data) {
        const temp = [];
        const final = match.board[match.board.length - 1];

        for (let board in final) {
          final[board].formattedName = final[board].name.replace(/TFT\d_/, "");
          final[board]["stars"] = Array(parseInt(final[board].level)).fill("");
          temp.push({
            ...final[board],
            position: board,
          });
        }
        match["board"] = temp;
        if (match.rank === "1") {
          match["rank"] = "1st";
        } else if (match.rank === "2") {
          match["rank"] = "2nd";
        } else if (match.rank === "3") {
          match["rank"] = "3rd";
        } else {
          match["rank"] = match.rank + "th";
        }
      }
      setMatches(data.data);
    };
    fetchData();
  }, [props.params.params.username, props.params.params.id]);
  const handleRoute = (id) => {
    props.history.push(props.history.location.pathname + `/${id}`);
  };
  if (matches.length < 1) {
    return null;
  }
  return (
    <div>
      <Box className={classes.containerBox}>
        <Container className={classes.container}>
          <Typography className={classes.header}>Your match history</Typography>
          <Divider className={classes.divider} />
          <Container className={classes.cardContainer}>
            {matches.map((match) => {
              return (
                <React.Fragment key={match._id}>
                  <Card key={match._id} className={classes.contentContainer}>
                    <CardContent
                      style={
                        sm
                          ? {
                              flexDirection: "column",

                              alignItems: "start",
                              gap: "15px",
                            }
                          : {}
                      }
                      onClick={() => handleRoute(match.matchid)}
                      className={classes.cardContent}
                    >
                      <Box
                        display="flex"
                        gridGap="20px"
                        alignItems="center"
                        className={classes.rankContainer}
                      >
                        <Typography>{match.rank}</Typography>

                        <div className={classes.heimerContainer}>
                          <img
                            className={classes.heimerImage}
                            src={`${process.env.PUBLIC_URL}/4557.png`}
                            alt=""
                          />
                        </div>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Grid
                          spacing={2}
                          container
                          alignItems="center"
                          className={classes.imageContainer}
                        >
                          {match.board.map((board) => {
                            return (
                              <Grid item key={board.position}>
                                <div
                                  key={Math.random()}
                                  className={classes.champContainer}
                                >
                                  <Tooltip title={board.formattedName}>
                                    <img
                                      className={style["champ-image"]}
                                      src={`${process.env.PUBLIC_URL}/tftchamps/${board.name}.png`}
                                      alt=""
                                    />
                                  </Tooltip>
                                  <div className={style["star-container"]}>
                                    {board.stars.map(() => {
                                      return (
                                        <Typography
                                          key={Math.random()}
                                          className={classes.starLevel}
                                        >
                                          ★
                                        </Typography>
                                      );
                                    })}
                                  </div>
                                </div>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </React.Fragment>
              );
            })}
          </Container>
        </Container>
      </Box>
    </div>
  );
};

export default MatchHistory;
