import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  image: {
    position: "absolute",
    top: "50%",

    left: "50%",
    maxWidth: "20px",
    transform: "translate(-50%, -50%)",
  },
}));

const HexagonSm = (props) => {
  const classes = useStyles();
  const width = 40;
  const height = width / 0.875;
  const [Svg, setSvg] = useState();
  useEffect(() => {
    const svgRc = () => {
      let name = props.trait.name.toLowerCase();
      if (name === "god-kings") {
        name = "godkings";
      }
      const src = require(`../../converted/${name}`);

      setSvg(src.default);
    };
    svgRc();
  }, [props.trait.name]);
  let SvgComp;
  if (Svg) {
    SvgComp = Svg.type;
  }
  return (
    <Box position="relative" display="flex" alignItems="center">
      <Box height="auto">
        <svg width={`${width}px`} height={height} viewBox="0 0 84 96">
          <defs>
            <clipPath id="myMask">
              <polygon
                points="184 24 226 -3.16413562e-15 268 24 268 72 226 96 184 72"
                transform="translate(-184, 0)"
              ></polygon>
            </clipPath>
          </defs>

          <path
            stroke="none"
            strokeWidth="4"
            fill={props.trait.style ? props.trait.style : "#424242"}
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
          ></path>
        </svg>
      </Box>

      {Svg && <SvgComp {...Svg.props} className={classes.image} fill="white" />}
    </Box>
  );
};

export default HexagonSm;
