import { makeStyles } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import CheckCircle from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import React from "react";
import { useParams } from "react-router-dom";
const useColorlibStepIconStyles = makeStyles((theme) => {
  return {
    root: {
      display: "block",
      color: theme.palette.text.disabled,
      "&$completed": {
        color: theme.palette.primary.main,
      },
      "&$active": {
        color: theme.palette.primary.main,
      },
      "&$error": {
        color: theme.palette.error.main,
      },
    },
    /* Styles applied to the SVG text element. */
    text: {
      fill: theme.palette.primary.contrastText,
      fontSize: theme.typography.caption.fontSize,
      fontFamily: theme.typography.fontFamily,
    },
    /* Pseudo-class applied to the root element if `active={true}`. */
    active: {},
    /* Pseudo-class applied to the root element if `completed={true}`. */
    completed: {},
    /* Pseudo-class applied to the root element if `error={true}`. */
    error: {},
  };
});
const CompletedIcon = (props) => {
  const params = useParams();

  const { completed = false, icon, active = false, error = false } = props;
  const classes = useColorlibStepIconStyles();
  if (typeof icon === "number" || typeof icon === "string") {
    const className = clsx(classes.root, {
      [classes.active]: active,
      [classes.error]: error,
      [classes.completed]: completed,
    });

    if (props.completed) {
      if (
        props.round.round_type.name === "PVP" &&
        props.round.round_outcome &&
        props.round.round_outcome[params.username] &&
        props.round.round_outcome[params.username].outcome === "victory"
      ) {
        return <CheckCircle className={className} />;
      } else if (props.round.round_type.name === "PVE") {
        return <CheckCircle className={className} />;
      }
      return <CloseIcon className={className}></CloseIcon>;
    }

    return (
      <SvgIcon className={className}>
        <circle cx="12" cy="12" r="12" />
        <text className={classes.text} x="12" y="16" textAnchor="middle">
          {props.icon}
        </text>
      </SvgIcon>
    );
  }
};

export default CompletedIcon;
