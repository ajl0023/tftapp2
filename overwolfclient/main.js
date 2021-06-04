import axios from "axios";
import { startLauncher } from "./launcherInfo";

var g_interestedInFeatures = [
  "counters",
  "match_info",
  "me",
  "roster",
  "store",
  "board",
  "bench",
  "carousel",
  "live_client_data",
  "lobby_info",
];

let currRound = "start";
let currStage;
let rounds = [];
let allEvents = [];
let roundType;
let currRoundInfo;
let matchEnded = false;
let current_round_data = {
  store: [],

  bench: [],
  board: [],
  carousel: [],
  round_type: {},
  gold: 0,

  first_round: [],
  round: "start",
};

var onErrorListener, onInfoUpdates2Listener, onNewEventsListener;

const needsParsed = ["store", "board", "carousel", "bench"];

function resetState() {
  current_round_data.store = [];

  current_round_data.carousel = [];
  current_round_data.board = [];
  current_round_data.bench = [];
  current_round_data.gold = "";
  current_round_data.health = "";
  current_round_data.carouselArr = "";
  current_round_data.round_outcome = {};
  current_round_data.round_type = {};
  current_round_data.xp = {};
  current_round_data.round = null;
  currRound = "start";
  matchEnded = false;
}

function addToData(prop) {
  const objProp = Object.getOwnPropertyNames(prop)[0];
  let data;

  const dataToParse = prop[objProp];
  if (needsParsed.includes(objProp)) {
    if (objProp === "store") {
      data = getParsedData(dataToParse[`shop_pieces`]);
      current_round_data["store"].push(data);
    }

    if (objProp === "carousel" || objProp === "bench") {
      data = getParsedData(dataToParse[`${objProp}_pieces`]);
      current_round_data[objProp].push(data);
      if (objProp === "carousel") {
        current_round_data["carouselArr"] = data;
      }
    }
    if (objProp === "board" && roundType && roundType.name === "round_start") {
      data = getParsedData(dataToParse[`${objProp}_pieces`]);

      current_round_data[objProp].push(data);
    }
  } else if (objProp === "me") {
    const meData = prop[objProp]; //"{rank:4}"

    const meobjProp = Object.getOwnPropertyNames(meData)[0]; //"rank"

    current_round_data[meobjProp] = meData[meobjProp];
  }
}
const match_info_data = ["opponent", "round_type", "round_outcome"];
function handleMatchInfoData(data) {
  let parseData;

  const objProp = Object.getOwnPropertyNames(data)[0];
  const parsedRank = parseInt(current_round_data.rank);

  if (objProp === "match_state" || parsedRank > 0) {
    const sessRounds = sessionStorage.getItem("rounds");

    parseData = getParsedData(data[objProp]);

    sessionStorage.setItem("event", JSON.stringify(parseData));

    if (parseData.in_progress === false) {
      const formattedRounds = rounds.map((round, i) => {
        if (round.carouselArr && round.carouselArr.length > 0) {
          const prev = rounds[i - 1].round_type.stage;
          const next = rounds[i + 1].round_type.stage;
          const roundCheck = prev || next;
          rounds[i].round_type.stage = `${roundCheck[0]}-4`;
        }
        round["sortCount"] = i;
        return round;
      });
      axios
        .post("http://localhost:7000/api/match-history", {
          rounds: formattedRounds,
          rank: current_round_data.rank,
          current_round_data,
          currRound: currRound,
        })
        .then(() => {
          current_round_data.rank = "0";
          resetState();

          rounds = [];
          allEvents = [];
          unregisterEvents();
        })
        .catch(() => {
          current_round_data.rank = "0";
          resetState();

          rounds = [];
          allEvents = [];
          unregisterEvents();
        });
      if (sessRounds) {
        sessionStorage.removeItem("round");
        sessionStorage.removeItem("rounds");
        sessionStorage.removeItem("allEvents");
      }
    }
  }
  if (match_info_data.includes(objProp)) {
    parseData = getParsedData(data[objProp]);

    if (!current_round_data[objProp]) {
      current_round_data[objProp] = parseData;
    }

    if (objProp === "round_type") {
      current_round_data[objProp] = parseData;
      current_round_data.round = parseData.stage;
      currStage = parseData.stage;
    }
    current_round_data[objProp] = parseData;
  }
}
function getParsedData(data) {
  return JSON.parse(data);
}
function handleLiveClientData(data) {
  if (data.active_player) {
    const parsed = getParsedData(data.active_player);
    if (
      current_round_data["health"] &&
      current_round_data["level"] &&
      current_round_data["summoner_name"]
    ) {
      return;
    }

    current_round_data["health"] = parsed.championStats.currentHealth;
    current_round_data["level"] = parsed.level;
    current_round_data["summoner_name"] = parsed.summonerName;
  }
}

function registerEvents(data) {
  onErrorListener = function () {};

  onInfoUpdates2Listener = function (info) {
    const incoming_data = info.info;

    if (incoming_data.match_info) {
      handleMatchInfoData(incoming_data.match_info);
    } else if (incoming_data.live_client_data) {
      handleLiveClientData(incoming_data.live_client_data);
    } else {
      addToData(incoming_data);
    }
  };

  onNewEventsListener = function (info) {
    const events = info.events[0];
    let roundTemp = [0];
    if (current_round_data.round) {
      roundTemp = current_round_data.round[0];
    }

    allEvents.push(info.events[0]);
    const copy = {
      ...current_round_data,
    };

    roundType = events;
    if (currRound === current_round_data.round) {
      currRound = "same_round";
    }
    if (events.name === "match_end") {
      matchEnded = true;
    }

    if (
      currRound !== "round_start" &&
      events.name === "round_start" &&
      ((currRound !== "start" && currRound !== current_round_data.round) ||
        current_round_data.round)
    ) {
      current_round_data.round_type["stage"] = currRound;

      const round = current_round_data.round_type.stage;
      if (
        current_round_data.carousel.length > 0 &&
        round &&
        round[0] !== "1" &&
        currRound !== current_round_data.round
      ) {
        current_round_data.round_type.stage = `${round[0]}-5`;
      }

      rounds.push(copy);
      sessionStorage.setItem("round", JSON.stringify(copy));
      sessionStorage.setItem("rounds", JSON.stringify(rounds));
      sessionStorage.setItem("allEvents", JSON.stringify(allEvents));
      resetState();
    }
    if (
      currStage &&
      events.name === "battle_start" &&
      events.data === "carousel"
    ) {
      copy.roundCheck = `${currStage[0]}-4`;
      sessionStorage.setItem("round", JSON.stringify(copy));
      sessionStorage.setItem("rounds", JSON.stringify(rounds));
      sessionStorage.setItem("allEvents", JSON.stringify(allEvents));
      rounds.push(copy);
    }

    if (currRound === "1-1" && events.name === "battle_start") {
      sessionStorage.setItem("round", JSON.stringify(copy));
      sessionStorage.setItem("rounds", JSON.stringify(rounds));
      sessionStorage.setItem("allEvents", JSON.stringify(allEvents));
      rounds.push(copy);
    }
    currRound = currStage;
  };

  // general events errors
  overwolf.games.events.onError.addListener(onErrorListener);

  // "static" data changed (total kills, username, steam-id)
  // This will also be triggered the first time we register
  // for events and will contain all the current information
  overwolf.games.events.onInfoUpdates2.addListener(onInfoUpdates2Listener);
  // an event triggerd

  overwolf.games.events.onNewEvents.addListener(onNewEventsListener);
}

function unregisterEvents() {
  overwolf.games.events.onError.removeListener(onErrorListener);
  overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener);
  overwolf.games.events.onNewEvents.removeListener(onNewEventsListener);
}

function gameLaunched(gameInfoResult) {
  if (!gameInfoResult) {
    return false;
  }

  if (!gameInfoResult.gameInfo) {
    return false;
  }

  if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
    return false;
  }

  if (!gameInfoResult.gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if (Math.floor(gameInfoResult.gameInfo.id / 10) != 5426) {
    return false;
  }

  return true;
}

function gameRunning(gameInfo) {
  if (!gameInfo) {
    return false;
  }

  if (!gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if (Math.floor(gameInfo.id / 10) != 5426) {
    return false;
  }

  return true;
}

function setFeatures() {
  overwolf.games.events.setRequiredFeatures(
    g_interestedInFeatures,
    function (info) {
      if (info.status == "error") {
        window.setTimeout(setFeatures, 2000);
        return;
      }
    }
  );
}

// Start here
overwolf.games.onGameInfoUpdated.addListener(function (res) {
  if (gameLaunched(res)) {
    unregisterEvents();
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
});

overwolf.games.getRunningGameInfo(function (res) {
  if (gameRunning(res)) {
    unregisterEvents();
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
});

function resetMatch() {
  resetState();
}
startLauncher(resetMatch);
