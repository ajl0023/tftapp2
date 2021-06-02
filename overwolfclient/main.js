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
let roundType;
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
let count = 0;
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

  count = 0;
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
    if (
      current_round_data["health"] &&
      current_round_data["level"] &&
      current_round_data["summoner_name"]
    ) {
      return;
    }
    const parsed = getParsedData(data.active_player);
    current_round_data["health"] = parsed.championStats.currentHealth;
    current_round_data["level"] = parsed.level;
    current_round_data["summoner_name"] = parsed.summonerName;
  }
}

function registerEvents() {
  onErrorListener = function () {};

  onInfoUpdates2Listener = function (info) {
    const incoming_data = info.info;
    if (incoming_data.me) {
    }
    if (incoming_data.match_info) {
      handleMatchInfoData(incoming_data.match_info);
    } else if (incoming_data.live_client_data) {
      handleLiveClientData(incoming_data.live_client_data);
    } else {
      addToData(incoming_data);
    }
  };
  let countSort = 0;

  function postData(events) {
    if (
      current_round_data.rank.length > 0 &&
      current_round_data.rank !== "0" &&
      count < 4 &&
      matchEnded
    ) {
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
          resetState();
          countSort = 0;
          rounds = [];
          unregisterEvents();
        })
        .catch(() => {
          resetState();
          countSort = 0;
          rounds = [];
        });
      return;
    } else {
      postData(events);
      count = count + 1;
    }
  }

  onNewEventsListener = function (info) {
    const copy = {
      ...current_round_data,
    };
    const events = info.events[0];
    roundType = events;

    if (currRound === current_round_data.round) {
      currRound = "same_round";
    }

    if (
      currRound !== "round_start" &&
      events.name === "round_start" &&
      ((currRound !== "start" && currRound !== "same_round") ||
        current_round_data.round)
    ) {
      current_round_data.round_type["stage"] = currRound;

      const round = current_round_data.round_type.stage;
      if (current_round_data.carousel.length > 0 && round && round[0] !== "1") {
        current_round_data.round_type.stage = `${round[0]}-5`;
      }
      rounds.push(copy);

      resetState();
    }
    if (
      currStage &&
      events.name === "battle_start" &&
      events.data === "carousel"
    ) {
      copy.roundCheck = `${currStage[0]}-4`;
      rounds.push(copy);
    }

    if (currRound === "1-1" && events.name === "battle_start") {
      rounds.push(copy);
    }
    currRound = currStage;
    if (events.name === "match_end" || current_round_data.health === 0) {
      matchEnded = true;
      postData(events);
    }
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
startLauncher(resetState, registerEvents);
