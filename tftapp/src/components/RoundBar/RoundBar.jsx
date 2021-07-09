import {
    Box,
    Button,
    Grid,
    Hidden,
    MobileStepper,
    StepButton,
    useMediaQuery
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Step from "@material-ui/core/Step";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import CompletedIcon from "../CompletedIcon/CompletedIcon";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  root: {
    "&.MuiPaper-root": {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      width: "100%",
    },

    "& .MuiStepLabel-label": {
      color: "white",
    },

    "&.MuiStepper-root": {
      padding: "0px",
    },
    "& .MuiStepLabel-label.MuiStepLabel-completed": {
      color: "rgba(0, 0, 0, 0.54)",
    },
  },
  mobileStepper: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#0277bd",
    },
  },
}));

const RoundBar = (props) => {
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  const handleNextRound = useRef(true);
  const activeStepRef = useRef(0);
  const [stepper, setStepper] = useState();

  useEffect(() => {
    if (
      props.rounds &&
      !props.rounds[props.currRound].last &&
      props.rounds[props.currRound].round_type.stage
    ) {
      const currStage = props.rounds[props.currRound].round_type.stage[0];

      if (!stepper) {
        const filtered = props.rounds
          .map((round) => {
            if (round.round_type.stage) {
              return {
                stage: round.round_type.stage,
                ...round,
              };
            } else {
              return null;
            }
          })
          .filter((stage) => {
            return stage && stage.stage[0] === currStage;
          });

        setStepper(filtered);
        return;
      }

      if (
        handleNextRound.current !==
          props.rounds[props.currRound].round_type.stage[0] &&
        props.currRound !== 0 &&
        handleNextRound.current
      ) {
        const filtered = props.rounds
          .map((round) => {
            if (round.round_type.stage) {
              return {
                stage: round.round_type.stage,
                ...round,
              };
            }
            return null;
          })
          .filter((stage) => {
            return stage && stage.stage[0] === currStage;
          });

        setStepper(filtered);
      }

      handleNextRound.current =
        props.rounds[props.currRound].round_type.stage[0];
    }
  }, [props.rounds, props.currRound, stepper]);

  if (!stepper || !props.rounds || props.rounds.length < 1) {
    return null;
  }
  activeStepRef.current = stepper.findIndex((item) => {
    return item.stage === props.rounds[props.currRound].round_type.stage;
  });
  return (
    <>
      <Hidden xsDown>
        <Grid item xs={12}>
          <Box
            borderRadius="5px"
            padding="10px"
            bgcolor="secondary.main"
            color="white"
            className={classes.container}
            justifyContent="center"
            marginBottom="10px"
            border="#9e9e9e
          0.5px solid"
          >
            <Stepper
              nonLinear
              alternativeLabel={md ? false : true}
              className={classes.root}
              activeStep={activeStepRef.current}
            >
              {stepper.map((label) => {
                const stepProps = {};
                const labelProps = {};

                if (label.carousel.length > 0 && md) {
                  labelProps.optional = (
                    <Typography variant="caption">Carousel</Typography>
                  );
                }

                return (
                  <Step {...stepProps} key={label.round_type.stage}>
                    <StepButton
                      onClick={() => {
                        props.selectRound(label._id);
                      }}
                      children={(curr) => {
                        return <CompletedIcon {...curr} round={label} />;
                      }}
                      {...labelProps}
                    >
                      {label.round_type.stage}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Box display="flex" justifyContent="center" width="100%">
          <Divider></Divider>
          <MobileStepper
            style={{
              background: "inherit",
              width: "100%",
            }}
            position="static"
            steps={stepper.length}
            activeStep={activeStepRef.current}
            variant="progress"
            className={classes.mobileStepper}
            nextButton={
              <Button
                style={{
                  color: "white",
                }}
                size="small"
                onClick={props.nextRound}
                disabled={props.currRound === props.rounds.length - 1}
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                style={{
                  color: "white",
                }}
                size="small"
                onClick={props.prevRound}
                disabled={props.currRound === props.rounds.length - 1}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          ></MobileStepper>
        </Box>
      </Hidden>
    </>
  );
};

export default RoundBar;
