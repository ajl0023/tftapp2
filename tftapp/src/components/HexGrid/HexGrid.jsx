import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import Hexagon from "../Hexagon";

const useStyles = makeStyles((theme) => ({
  boardPiece: {
    position: "absolute",
    width: "100%",

    height: "100%",
  },
  mainDivider: {
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
    marginBottom: "20px",
  },
  container: {},
  hexagon: {},
  hexContainer: {
    display: "flex",
    fontSize: "8px",
    flexWrap: "wrap",
  },
}));

const HexGrid = (props) => {
  const classes = useStyles();

  const [board, setBoard] = useState([]);
  useEffect(() => {}, [props.board]);
  useEffect(() => {
    const board = [[], [], [], []];
    let count = 1;
    for (let row of board) {
      for (let i = count; i < count + 7; i++) {
        row.push("cell_" + i);
      }
      count += 7;
    }
    setBoard(board.reverse());
  }, []);
  if (!props.board) {
    return null;
  }
  let ii = 0;
  return (
    <Box className={classes.container}>
      <div className={classes.hexContainer}>
        {board.map((board) => {
          return board.map((position, i) => {
            ii++;
            const find = props.board.board.find((board) => {
              if (board.position === position) {
                board.hoverName = board.name.split("_")[1];
              }
              return board.position === position;
            });

            return (
              <Hexagon
                key={position}
                name={position}
                i={i}
                ii={ii}
                champion={find}
              />
            );
          });
        })}
      </div>
    </Box>
  );
};

export default HexGrid;
