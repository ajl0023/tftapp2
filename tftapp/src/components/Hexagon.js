import { Box } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useMemo } from "react";
import allItems from "../items.json";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    width: `13.2653%`,
  },
  itemImage: {
    maxWidth: "3em",
  },
  xsitemImage: {
    maxWidth: "1.5em",
  },
  inactive: { display: "none" },
  hexagonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  starImg: {
    fontSize: "2em",
    color: "gold",
    textShadow: "2px 4px 3px rgba(0,0,0,0.3)",
  },
}));
const Hexagon = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const items = useMemo(() => {
    const arr = [];
    if (props.champion) {
      for (let i = 1; i < 4; i++) {
        if (props.champion[`item_${i}`].length > 0) {
          arr.push(props.champion[`item_${i}`]);
        }
      }
    }
    const formattedItem = arr.reduce((acc, item) => {
      const split = item.split("/");
      const itemName = split[2];
      const regex = /[\W_]/gim;
      const originalName = item;

      let formatted;

      if (item === "TFT5_Item_Jeweled_Gauntlet_Shadow.TFT_Set5") {
        formatted = "SJeweledGauntlet".toUpperCase();
      } else {
        if (itemName) {
          formatted = itemName.replace(regex, "").toUpperCase();
        }
      }

      const find = allItems.find((item) => {
        return (
          item.name.replace(regex, "").toUpperCase() === formatted ||
          (item.OWName &&
            item.OWName.replace(regex, "").toUpperCase() === formatted) ||
          item.OWName === originalName
        );
      });

      if (find) {
        acc.push(find);
      }

      return acc;
    }, []);

    return formattedItem;
  }, [props.champion]);

  const star = [];
  if (props.champion) {
    for (let i = 0; i < props.champion.level; i++) {
      star.push("");
    }
  }
  const hexagon = (
    <svg
      style={{ width: "100%", height: "auto", display: "block" }}
      width="84px"
      height="96px"
      viewBox="0 0 84 96"
    >
      <defs>
        <clipPath id="myMask">
          <polygon
            points="184 24 226 -3.16413562e-15 268 24 268 72 226 96 184 72"
            transform="translate(-184, 0)"
          ></polygon>
        </clipPath>
      </defs>
      {props.champion ? (
        <image
          href={
            props.trait
              ? `${process.env.PUBLIC_URL}/tfttraits/${props.trait.name}.svg`
              : `${process.env.PUBLIC_URL}/tftchamps/${props.champion.name}.png`
          }
          width="100"
          height="100"
          x="-4"
          y="-2"
          clipPath="url(#myMask)"
          transform="translate(0, 0)"
        ></image>
      ) : (
        ""
      )}
      <path
        stroke="none"
        strokeWidth="4"
        fill="#1A123E"
        opacity={(props.champion || props.trait) && "0"}
        d="M186,25.1606451 L186,70.8393549 L226,93.6964978 L266,70.8393549 L266,25.1606451 L226,2.30350221 L186,25.1606451 Z"
        transform="translate(-184, 0)"
        id="slot-overlay-icon"
      ></path>
      <path
        stroke="rgb(134, 92, 73)"
        strokeWidth="4"
        fill="none"
        d="M186,25.1606451 L186,70.8393549 L226,93.6964978 L266,70.8393549 L266,25.1606451 L226,2.30350221 L186,25.1606451 Z"
        transform="translate(-184, 0)"
      ></path>{" "}
    </svg>
  );
  return (
    <div
      style={{
        marginLeft: props.ii === 8 || props.ii === 22 ? "calc(13.2653%/2)" : "",
        padding: "0.5em 0.5em 0.4em",
      }}
      className={classes.container}
    >
      <div
        className={classes.hexagonContainer}
        style={{
          width: "100%",
        }}
      >
        <Box
          position="absolute"
          top="-10px"
          display="flex"
          className={classes.starContainer}
        >
          {star.map((star, i) => {
            return (
              <span key={i} className={classes.starImg}>
                ★
              </span>
            );
          })}
        </Box>

        {props.champion && props.champion.hoverName ? (
          <Tooltip title={props.champion && props.champion.hoverName}>
            {hexagon}
          </Tooltip>
        ) : (
          hexagon
        )}

        <Box position="absolute" bottom="0" display="flex">
          {items.map((item, i) => {
            return (
              <img
                key={i}
                className={xs ? classes.xsitemImage : classes.itemImage}
                src={`${process.env.PUBLIC_URL}/tftitems/${item.id}.png`}
                alt=""
              />
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default Hexagon;
