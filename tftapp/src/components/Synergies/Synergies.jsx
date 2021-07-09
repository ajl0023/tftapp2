import { Box, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useState } from "react";
import synergies from "../../champions.json";
import traits from "../../traits.json";
import HexagonSm from "./HexagonSm";

const Synergies = (props) => {
  const [synergy, setSynergy] = useState([]);
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    if (props.board) {
      const arr = [];
      const copySynergy = {};
      const board = props.board.board.map((item) => {
        return item.name;
      });
      const mapBoard = board.reduce((acc, name) => {
        if (!acc.includes(name)) {
          acc.push(name);
        }
        return acc;
      }, []);

      for (let champ of mapBoard) {
        const find = synergies.find((item) => {
          return item.championId === champ;
        });
        if (find) {
          arr.push(...find.traits);
        }
      }
      for (let trait of arr) {
        if (!copySynergy[trait]) {
          copySynergy[trait] = {
            count: 0,
            min: traits.find((currTrait) => {
              return currTrait.key === trait;
            }),
          };
        }
        copySynergy[trait].count++;
      }

      const finalArr = [];
      for (let trait in copySynergy) {
        if (
          copySynergy[trait].count >=
          copySynergy[trait].min.sets[copySynergy[trait].min.sets.length - 1]
            .min
        ) {
          finalArr.push({
            ...copySynergy[trait].min.sets[
              copySynergy[trait].min.sets.length - 1
            ],
            name: copySynergy[trait].min.name,
          });
        } else {
          const find = copySynergy[trait].min.sets.find((curr) => {
            return (
              copySynergy[trait].count >= curr.min &&
              copySynergy[trait].count <= curr.max
            );
          });

          if (find) {
            if (find.style === "gold") {
              find.style = "#81390B";
            }
            if (find.style === "bronze") {
              find.style = "#81390B";
            }
            if (find.style === "chromatic") {
            }
            finalArr.push({
              ...find,
              ...copySynergy[trait],
              name: copySynergy[trait].min.name.toLowerCase(),
            });
          } else {
            finalArr.push({
              ...copySynergy[trait],
              name: copySynergy[trait].min.name.toLowerCase(),
            });
          }
        }
      }
      setSynergy(finalArr);
    }
  }, [props.board]);
  return (
    <Grid
      container
      spacing={0}
      style={{
        maxHeight: md ? "120px" : "",

        overflowY: "auto",
      }}
    >
      {synergy.map((trait) => {
        return (
          <React.Fragment key={trait.name}>
            <Grid
              style={{ height: "fit-content", padding: "4px" }}
              item
              xs={6}
              sm={6}
              md={12}
            >
              <Box
                border="0.5px solid rgb(158, 158, 158)"
                display="flex"
                padding="8px 10px"
                alignItems="center"
                borderRadius="4px"
                gridGap="8px"
              >
                <HexagonSm key={trait.name} trait={trait}></HexagonSm>

                <Box
                  textOverflow="ellipsis"
                  fontFamily="Roboto Condensed"
                  overflow="hidden"
                  style={{
                    textTransform: "uppercase",
                    fontSize: "0.6rem",
                    letterSpacing: "0.05em",
                  }}
                  whiteSpace="nowrap"
                >
                  {trait.name + " "}
                  {trait.count}
                </Box>
              </Box>
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default Synergies;
