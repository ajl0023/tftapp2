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
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./client", "index.html"));
  });
  app.post("/api/match-history", async (req, res) => {
    const rounds = req.body.rounds;
    const matchid = new ObjectId();
    const userid = new ObjectId();

    const finduserName = () => {
      for (let round of rounds) {
        if (round.summoner_name && round.summoner_name.length > 0) {
          return round.summoner_name;
        }
      }
    };
    const username = finduserName();

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
      rank: req.body.rank,
      current_round_data: req.body.current_round_data,
      lastRound: req.body.currRound,
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
      const foundMatch = await matchesdb.findOne({ _id: ObjectId(match) });

      roundsProm.push(
        roundsdb
          .find({
            matchid: ObjectId(match),
            board: {
              $gt: { $size: 1 },
            },
          })
          .sort({ sortCount: 1 })
          .toArray()
          .then((rounds) => {
            const lastRound = rounds[rounds.length - 1];

            lastRound["rank"] = foundMatch.rank;

            return lastRound;
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
      .sort({ sortCount: 1 })

      .toArray();
    const matchData = await matchesdb.findOne({
      _id: ObjectId(matchid),
    });
    const rank = matchData.rank;
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
        i > 0 &&
        match[i].board.length === 0 &&
        match[i - 1].board.length > 0
      ) {
        match[i].board = match[i - 1].board;
      }
      if (match[i].round_type.stage === "same_round") {
        match[i].round_type.stage = match[i].round;
      } else if (
        match[i].board.length > 0 &&
        match[i].round_type.stage &&
        ((match[i].round_type.stage !== "same_round" &&
          match[i].round_type.stage[0] === "s") ||
          ((!match[i].round_type || !match[i].round_type.stage) &&
            i !== match.length - 1))
      ) {
        let currRound;
        let currStage;
        match[i].round_type["stage"] = "match_start";
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

    function fillBoard() {
      for (let i = 0; i < match.length; i++) {
        if (
          match[i - 1] &&
          match[i - 1].board.length > 0 &&
          match[i].board.length === 0
        ) {
          match[i].board = match[i - 1].board;
        }
      }
    }
    fillBoard();

    const filteredMatch = match.filter(
      (round) => round.board.length > 0 && !round.roundCheck
    );
    const findround1_2 = filteredMatch.findIndex((round) => {
      return (
        round.round_type.name === "PVE" &&
        round.round_type.type === "Minions_1" &&
        round.round_type.stage === "1-3"
      );
    });

    if (findround1_2 >= 0) {
      filteredMatch[findround1_2].round_type.stage = "1-2";
    }
    const lastRoundData = matchData.current_round_data;

    if (lastRoundData.bench.length < 1) {
      lastRoundData.bench = lastRound.bench;
    }

    if (lastRound.health !== "0" && lastRoundData.bench > 0) {
      filteredMatch.push(lastRoundData);
      lastRoundData.round_type["stage"] = matchData.lastRound;
    }

    res.json({
      filteredMatch,
      rank,
    });
  });
  app.delete("/api/match-history", async (req, res) => {
    const currdb = db.db("tft-matches");

    currdb.dropDatabase();
    res.json("done");
  });
  app.delete("/api/match-history2", async (req, res) => {
    const idsToDelete = ["60b9389ab8bfe73d6824f61c"];
    for (let id of idsToDelete) {
      await matchesdb.deleteOne({ _id: ObjectId(id) });
      await roundsdb.deleteMany({ matchid: ObjectId(id) });
      await usersdb.updateOne(
        { _id: ObjectId("60b6cc4fcad875103412be66") },
        {
          $pull: {
            matches: ObjectId(id),
          },
        }
      );
    }
    res.json("done");
  });

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client", "index.html"));
  });
};
