const e = require("cors");
const { ObjectId } = require("mongodb");
const { getMatchesdb, getRoundsdb, getUsersdb, getdb } = require("./mongoUtil");
const db = getdb();
const matchesdb = getMatchesdb();
const roundsdb = getRoundsdb();
const usersdb = getUsersdb();
const path = require("path");
const fs = require("fs");
module.exports = function (app) {
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./build", "index.html"));
  });
  app.post("/api/match-history", async (req, res) => {
    const rounds = req.body.rounds;
    const matchid = new ObjectId();
    const userid = new ObjectId();
    const username = rounds[0].summoner_name;

    const findUser = await usersdb.findOne({
      username: username,
    });

    const matchRounds = rounds.map((round) => {
      round["matchid"] = matchid;
      return round;
    });

    const roundsProm = roundsdb.insertMany(matchRounds);
    const matchProm = matchesdb.insertOne({
      _id: matchid,
      user: findUser ? findUser._id : userid,
    });

    let userProm;
    if (!findUser) {
      userProm = usersdb.insertOne({
        _id: userid,
        username,
        matches: [matchid],
      });
    } else {
      userProm = usersdb.updateOne(
        {
          username: username,
        },
        {
          $push: {
            matches: matchid,
          },
        }
      );
    }
    await Promise.all([roundsProm, matchProm, userProm]);
    res.json("done");
  });
  app.get("/api/match-history/:username", async (req, res) => {
    const username = req.params.username;

    const userId = await usersdb.findOne({ username: username });

    if (!userId) {
      return;
    }
    const matches = userId.matches;

    const roundsProm = [];
    const obj = {};
    for (let match of matches) {
      roundsProm.push(
        roundsdb
          .find({
            matchid: ObjectId(match),
          })
          .toArray()
          .then((rounds) => {
            const lastRound = rounds[rounds.length - 1];
            const health = parseInt(lastRound.health);
            if (health > 0 && lastRound.board.length > 0) {
              return lastRound;
            } else {
              rounds[rounds.length - 2]["rank"] = lastRound.rank;
              return rounds[rounds.length - 2];
            }
          })
      );
    }

    const round = await Promise.all(roundsProm);

    res.json(round);
  });
  app.get("/api/match-history/:username/:id", async (req, res) => {
    const username = req.params.username;
    const matchid = req.params.id;
    const match = await roundsdb
      .find({
        matchid: ObjectId(matchid),
      })
      .toArray();

    let currRound;
    let currStage;
    const lastRound = match[match.length - 1];
    if (!lastRound.round_type.stage) {
      const prevRound = parseInt(match[match.length - 2].round_type.stage[0]);
      const prevStage = parseInt(match[match.length - 2].round_type.stage[2]);
      if (prevStage === 7) {
        currRound = prevRound + 1;
        currStage = 1;
      } else {
        currRound = prevRound;
        currStage = prevStage + 1;
      }
      match[match.length - 1].round_type = {
        stage: `${currRound}-${currStage}`,
      };
    }

    for (let i = 0; i < match.length; i++) {
      if (
        (!match[i].round_type || !match[i].round_type.stage) &&
        i !== match.length - 1
      ) {
        let currRound;
        let currStage;

        const nextRound = parseInt(match[i + 1].round_type.stage[0]);
        const nextStage = parseInt(match[i + 1].round_type.stage[2]);
        if (nextStage === 1) {
          currRound = nextRound - 1;
          currStage = 7;
        } else {
          currRound = nextRound;
          currStage = nextStage - 1;
        }
        match[i].round_type = {
          stage: `${currRound}-${currStage}`,
        };
      }
    }

    res.json(match);
  });
  app.delete("/api/match-history", async (req, res) => {
    const currdb = db.db("tft-matches");

    currdb.dropDatabase();
    res.json("done");
  });
};
