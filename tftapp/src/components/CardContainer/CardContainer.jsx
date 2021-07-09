import { Backdrop, Box, ListItem } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import BuildIcon from "@material-ui/icons/Build";
import Crop75Icon from "@material-ui/icons/Crop75";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import React, { useMemo } from "react";
import allItems from "../../items.json";

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
    backgroundColor: theme.palette.secondary.main,
    marginBottom: "20px",
  },
  hexContainer: {
    position: "relative",
  },
  playerStatus: {
    display: "flex",
    alignItems: "center",

    gap: "10px",
  },
  statusIcon: {
    width: "20px",
  },
  statusItemContainer: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
  },
  champImageContainer: {
    width: "40px",
    padding: "0px",
    position: "relative",
  },
  champImage: {
    width: "100%",
    padding: "0px",
    display: "block",
  },
  listContainer: {
    borderRadius: "5px",

    backgroundColor: theme.palette.secondary.main,
  },
  divider: {
    backgroundColor: "white",
    margin: "5px",
    maxHeight: "50%",
  },
  soldImage: {
    position: "absolute",

    width: "100%",
    zIndex: "5",
  },
  inactive: {
    display: "none",
  },
}));
const CardContainer = (props) => {
  const classes = useStyles();

  const prevStore = props.prevStore;
  const nextStore = props.nextStore;
  const rounds = props.rounds;
  const bench = useMemo(() => {
    const arr = [];

    if (props.content && props.content.length > 0) {
      const lastBench = props.content[props.content.length - 1];
      for (let item in lastBench) {
        if (lastBench[item].name) {
          lastBench[item]["formattedName"] = lastBench[item].name.split("_")[1];
        }
        arr.push(lastBench[item]);
      }
    }

    return arr;
  }, [props.content]);
  const items = useMemo(() => {
    if (props.content && props.header === "Items") {
      const arr = [];
      if (props.content) {
        const length = props.content.board.length;

        for (let i = 0; i < length; i++) {
          for (let j = 1; j < 4; j++) {
            if (props.content.board[i][`item_${j}`].length > 0) {
              arr.push(props.content.board[i][`item_${j}`]);
            }
          }
        }
      }

      const formattedArr = arr.reduce((acc, item) => {
        const split = item.split("/");
        const originalName = item;
        const itemName = split[2];
        const regex = /[\W_]/gim;

        let formatted;

        if (item === "TFT5_Item_Jeweled_Gauntlet_Shadow.TFT_Set5") {
          formatted = "SJeweledGauntlet".toUpperCase();
        } else {
          if (itemName) {
            formatted = itemName.replace(regex, "").toUpperCase();
          }
        }
        const find = allItems.find((item) => {
          if (formatted === "GaintsBelt".toUpperCase()) {
            return item.name === "Giant's Belt";
          }

          return (
            item.name.replace(regex, "").toUpperCase() === formatted ||
            (item.OWName &&
              item.OWName.replace(regex, "").toUpperCase() === formatted) ||
            item.OWName === originalName
          );
        });

        if (find) {
          acc.push({
            ...find,

            formattedName: find.name,
          });
        }

        return acc;
      }, []);

      return formattedArr;
    }
    return [];
  }, [props.header, props.content]);
  const iconHeader = () => {
    if (props.header === "Store") {
      return <MonetizationOnIcon></MonetizationOnIcon>;
    }
    if (props.header === "Bench") {
      return <Crop75Icon></Crop75Icon>;
    }
    if (props.header === "Items") {
      return <BuildIcon></BuildIcon>;
    }
  };
  if (!props.content) {
  }
  return (
    <Box
      border="#9e9e9e
 0.5px solid"
      color="white"
      className={classes.listContainer}
    >
      <Box padding="5px" display="flex" justifyContent="space-between">
        <Box color="white" gridGap="7px" display="flex" alignItems="center">
          {iconHeader()}
          <Typography>{props.header}</Typography>
          {props.header === "Store" ? (
            <>
              <Divider
                variant="inset"
                className={classes.divider}
                orientation="vertical"
              ></Divider>
              <Typography>{`Rolled ${props.rolls}`}</Typography>
            </>
          ) : (
            <div></div>
          )}
        </Box>

        <div>
          {props.header === "Store" && (
            <>
              <ArrowBackIcon onClick={() => prevStore("shop")}></ArrowBackIcon>
              <ArrowForwardIcon
                onClick={() => nextStore("shop")}
              ></ArrowForwardIcon>
            </>
          )}
        </div>
      </Box>
      <Box padding="12px" gridGap="5px" display="flex" maxWidth="400px">
        {props.header === "Store" && rounds
          ? props.content.map((champ, i) => {
              return (
                <ListItem
                  key={champ.name + i}
                  className={classes.champImageContainer}
                >
                  <Tooltip
                    title={
                      champ.sold
                        ? champ.formattedname + " (Purchased)"
                        : champ.formattedname
                    }
                  >
                    <div
                      style={{ display: "inline", height: "fit-content" }}
                      id="test"
                    >
                      <Backdrop
                        open={champ.sold || false}
                        className={
                          champ.sold ? classes.soldImage : classes.inactive
                        }
                      >
                        <div></div>
                      </Backdrop>
                      <img
                        className={classes.champImage}
                        src={`${process.env.PUBLIC_URL}/tftchamps/${champ.name}.png`}
                        alt=""
                      />
                    </div>
                  </Tooltip>
                </ListItem>
              );
            })
          : null}
        {props.header === "Items" && rounds
          ? items.map((item, i) => {
              return (
                <ListItem key={i} className={classes.champImageContainer}>
                  <Tooltip title={item.formattedName}>
                    <img
                      className={classes.champImage}
                      src={`${process.env.PUBLIC_URL}/tftitems/${item.id}.png`}
                      alt=""
                    />
                  </Tooltip>
                </ListItem>
              );
            })
          : null}{" "}
        {props.header === "Bench" && rounds
          ? bench.map((item, i) => {
              return (
                <ListItem key={i} className={classes.champImageContainer}>
                  <Tooltip title={item.formattedName}>
                    <img
                      className={classes.champImage}
                      src={`${process.env.PUBLIC_URL}/tftchamps/${item.name}.png`}
                      alt=""
                    />
                  </Tooltip>
                </ListItem>
              );
            })
          : null}
      </Box>
    </Box>
  );
};

export default CardContainer;
