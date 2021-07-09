import { Box, Container, Grid } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import gold from "../../images/gold.png";
import heart from "../../images/heart.png";
import CardContainer from "../CardContainer/CardContainer";
import HexGrid from "../HexGrid/HexGrid";
import RoundBar from "../RoundBar/RoundBar";
import Synergies from "../Synergies/Synergies";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: theme.palette.primary.main,
  },
  mainDivider: {
    width: "100%",

    marginBottom: "20px",
  },
  hexContainer: {
    position: "relative",
  },
  playerStatus: {
    display: "flex",
    alignItems: "center",

    gap: "10px",
    marginBottom: "20px",
  },
  statusIcon: {
    width: "20px",
  },
  statusItemContainer: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
  },
  shopItem: {
    maxWidth: "120px",
    padding: "0px",
  },
  shopImage: {
    maxWidth: "100%",
  },
  listContainer: {
    borderRadius: "5px",
    backgroundColor: theme.palette.secondary.main,
  },
  divider: {
    backgroundColor: "#9e9e9e",
    margin: "5px",
  },
  mainContainer: {
    flexGrow: "1",
  },
  rightContainer: {},
  synergyContainer: {},
}));

const Match = (props) => {
  const [rounds, setRounds] = useState();
  const [currRound, setCurrRound] = useState(0);
  const [currStore, setCurrStore] = useState(0);
  const [rank, setRank] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `/api/match-history/${props.params.params.username}/${props.params.params.id}`
      );
      for (let allData of data.data.filteredMatch) {
        if (allData.board.length > 0) {
          const finalBoard = allData.board[allData.board.length - 1];

          const arr = [];

          for (let board in finalBoard) {
            arr.push({
              ...finalBoard[board],
              position: board,
            });
            allData.board = arr;
          }
          if (allData.round_type && allData.round_type.stage) {
            allData.round_type["stage"] = allData.round_type.stage.replace(
              "-",
              "‑"
            );
          }
        }
        let store = [];
        let tempArr = [];
        let count = 0;
        for (let item of allData.store) {
          for (let shopItem in item) {
            count = count + 1;
            tempArr.push(item[shopItem]);

            if (count % 5 === 0 && count !== 0) {
              store.push(tempArr);
              tempArr = [];
            }
          }
        }

        allData["store"] = store;
      }
      data.data.filteredMatch[data.data.filteredMatch.length - 1][
        "last"
      ] = true;
      setRounds(data.data.filteredMatch);
      setRank(data.data.rank);
    };
    fetchData();
  }, [props.params.params.username, props.params.params.id]);
  const acc = useMemo(() => {
    let originalStore = [];
    let arr = [];
    if (rounds && rounds.length > 0 && rounds[currRound].store.length > 0) {
      for (let i = 0; i < rounds[currRound].store.length; i++) {
        const store = rounds[currRound].store[i];

        const find = store.find((item) => {
          return item.name === "Sold";
        });
        if (!find) {
          originalStore = store;
        } else {
          for (let j = 0; j < store.length; j++) {
            const item = store[j];
            if (item.name === "Sold") {
              originalStore[j] = {
                ...originalStore[j],
                sold: true,
              };
            }
          }
        }

        if (!find) {
          const formattedNames = originalStore.map((set) => {
            set.formattedname = set.name.split("_")[1];
            return set;
          });
          arr.push(formattedNames);
        }
      }
    }

    return arr;
  }, [rounds, currRound]);

  const nextRound = () => {
    if (currRound >= rounds.length - 1) {
      return;
    }

    setCurrRound(currRound + 1);
    setCurrStore(0);
  };
  const prevRound = () => {
    if (currRound === 0) {
      return;
    }
    setCurrStore(0);
    setCurrRound(currRound - 1);
  };

  const nextStore = () => {
    if (currStore >= acc.length - 1) {
      return;
    }

    setCurrStore(currStore + 1);
  };
  const prevStore = () => {
    if (currStore === 0) {
      return;
    }

    setCurrStore(currStore - 1);
  };
  const selectRound = (curr) => {
    const find = rounds.findIndex((round) => {
      return round._id === curr;
    });
    setCurrRound(find);
  };
  const classes = useStyles();

  return (
    <Box
      bgcolor="primary.main"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      color="white"
    >
      <Container maxWidth="xl" className={classes.mainContainer}>
        <Box padding="50px 50px">
          <Typography variant="h2" align="center">
            Match Analysis
          </Typography>
          <Typography variant="h5" align="center">
            Placement: {rank}
          </Typography>
        </Box>
        <Grid spacing={4} container>
          <RoundBar
            selectRound={selectRound}
            currRound={currRound}
            rounds={rounds}
            nextRound={nextRound}
            prevRound={prevRound}
          ></RoundBar>

          <Grid item xs={12} lg={2}>
            <Synergies board={rounds && rounds[currRound]}></Synergies>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Box
              color="white"
              border="#9e9e9e 0.5px solid"
              borderRadius="5px"
              padding="10px"
              bgcolor="secondary.main"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                className={classes.headerContainer}
              >
                <Box display="flex" gridGap="5px" alignItems="center">
                  <Typography>
                    Round{" "}
                    {rounds && rounds.length > 0
                      ? rounds[currRound].round_type.stage &&
                        rounds[currRound].round_type.stage === "same_round"
                        ? rounds[currRound].round
                        : rounds[currRound].round_type.stage
                      : null}
                    {/* rounds.length > 0 &&
                    rounds[currRound].round_type.stage &&
                    rounds[currRound].round_type.stage === "same_round"
                      ? rounds[currRound].round
                      : rounds[currRound].round_type.stage} */}
                  </Typography>
                </Box>
                <div>
                  <ArrowBackIcon
                    onClick={() => prevRound("board")}
                  ></ArrowBackIcon>
                  <ArrowForwardIcon
                    onClick={() => nextRound("board")}
                  ></ArrowForwardIcon>
                </div>
              </Box>
              <Divider className={classes.divider}></Divider>
              <div className={classes.playerStatus}>
                <Box className={classes.statusItemContainer}>
                  <img className={classes.statusIcon} src={gold} alt="" />
                  <Typography>{rounds && rounds[currRound].gold}</Typography>
                </Box>

                <Box className={classes.statusItemContainer}>
                  <img className={classes.statusIcon} src={heart} alt="" />
                  <Typography>{rounds && rounds[currRound].health}</Typography>
                </Box>
                <Box className={classes.statusItemContainer}>
                  <ArrowUpwardIcon
                    style={{ color: green[500] }}
                    className={classes.statusIcon}
                  ></ArrowUpwardIcon>
                  <Typography>{rounds && rounds[currRound].level}</Typography>
                </Box>
              </div>

              <HexGrid board={rounds && rounds[currRound]}></HexGrid>
            </Box>
          </Grid>
          <Grid xs={12} md={6} lg={4} container item>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              gridGap="14px"
            >
              <CardContainer
                header={"Store"}
                content={acc.length > 0 ? acc[currStore] : []}
                rolls={acc.length}
                rounds={rounds && rounds[currRound].store[currStore]}
                currRound={currRound}
                currStore={currStore}
                nextStore={nextStore}
                prevStore={prevStore}
              />

              <CardContainer
                header={"Bench"}
                content={rounds && rounds[currRound].bench}
                rounds={rounds}
                rolls={0}
              />

              <CardContainer
                header={"Items"}
                content={rounds && rounds[currRound]}
                rounds={rounds}
                rolls={0}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Match;
