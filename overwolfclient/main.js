import axios from "axios";
import "./testbutton";
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
];

let current_round;
let summoner_name;
let health;
let level;
let round;
let iscarousel;
let gameState = {};
let currRound;
let opponent;
let outcome;
let rounds = [];
let obj = {};
let current_round_data = {
  store: [],

  bench: [],
  board: [],
  carousel: [],
  gold: 0,
};

var onErrorListener, onInfoUpdates2Listener, onNewEventsListener;

const needsParsed = ["store", "board", "carousel", "bench"];

function addToData(prop) {
  const objProp = Object.getOwnPropertyNames(prop)[0];
  let data;

  const dataToParse = prop[objProp];
  if (needsParsed.includes(objProp)) {
    if (objProp === "store") {
      data = getParsedData(dataToParse[`shop_pieces`]);
      current_round_data["store"].push(data);
    } else {
      data = getParsedData(dataToParse[`${objProp}_pieces`]);
      current_round_data[objProp].push(data);
    }
  } else if (objProp === "me") {
    const meData = prop[objProp]; //"{rank:4}"
    const meobjProp = Object.getOwnPropertyNames(meData)[0]; //"rank"

    current_round_data[meobjProp] = meData[meobjProp]; // {}['rank'] = {rank:4}[rank]
  }
}
const match_info_data = ["opponent", "round_type", "round_outcome"];
function handleMatchInfoData(data) {
  let parseData;
  const objProp = Object.getOwnPropertyNames(data)[0];

  if (match_info_data.includes(objProp)) {
    parseData = getParsedData(data[objProp]);

    current_round_data[objProp] = parseData;
    let arr = [];
    // if (objProp === "round_outcome") {
    //   for (let item in current_round_data[objProp]) {
    //     arr.push(item);
    //   }
    // }
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
function resetState() {
  current_round_data.store = [];
  current_round_data.carousel = [];
  current_round_data.board = [];
  current_round_data.bench = [];
  current_round_data.gold = "";
  current_round_data.health = "";
  current_round_data.rank = "";
  current_round_data.round_outcome = {};
  current_round_data.round_type = {};
  current_round_data.xp = {};
}
function registerEvents() {
  onErrorListener = function (info) {};

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

  onNewEventsListener = function (info) {
    const events = info.events[0];

    if (events.name === "round_end" && current_round_data.health > 0) {
      const copy = {
        ...current_round_data,
      };
      console.log(copy);
      console.log(rounds);
      rounds.push(copy);

      resetState();
    } else if (events.name === "match_end" || current_round_data.health === 0) {
      axios
        .post("http://localhost:5000/api/match-history", {
          rounds,
        })
        .then(() => {
          resetState();
          rounds = [];
        })
        .catch(() => {
          resetState();
          rounds = [];
        });
    }
    if (events.name) console.log("EVENT FIRED: " + JSON.stringify(info));
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

const test = (test) => {};
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

function onRoundChange() {}

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
