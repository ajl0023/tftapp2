import axios from "axios";

export const startLauncher = (resetState) => {
  
  // When writing an app that consumes events - it is best if you request
  // only those features that you want to handle.
  //
  // NOTE: in the future we'll have a wildcard option to allow retrieving all
  // features
  var g_interestedInFeatures = [
    "game_flow",
    "summoner_info",
    "champ_select",
    "lcu_info",
    "lobby_info",
    "end_game",
    "game_info",
  ];

  var onErrorListener, onInfoUpdates2Listener, onNewEventsListener;

  function registerEvents() {
    onErrorListener = function (info) {};

    onInfoUpdates2Listener = function (info) {
      const matchCheck = sessionStorage.getItem("round");
      const roundsCheck = sessionStorage.getItem("rounds");

      if (
        matchCheck &&
        roundsCheck &&
        info.feature === "lobby_info" &&
        (info.lobby_info.queueId === "1090" ||
          info.lobby_info.queueId === "1100")
      ) {
        const parsedRounds = JSON.parse(roundsCheck);
        const formattedRounds = parsedRounds.map((round, i) => {
          if (round.carouselArr && round.carouselArr.length > 0) {
            const prev = parsedRounds[i - 1].round_type.stage;
            const next = parsedRounds[i + 1].round_type.stage;
            const roundCheck = prev || next;
            parsedRounds[i].round_type.stage = `${roundCheck[0]}-4`;
          }
          round["sortCount"] = i;
          return round;
        });
        axios
          .post("http://localhost:7000/api/match-history", {
            rounds: formattedRounds,
            rank: matchCheck ? matchCheck.rank : null,
            current_round_data: matchCheck,
            currRound: matchCheck ? matchCheck.round_type : null,
          })
          .then(() => {
            resetState();
          })
          .catch(() => {
            resetState();
          });
        if (sessionStorage.getItem("round")) {
          sessionStorage.removeItem("round");
        }

        sessionStorage.removeItem("rounds");
      }
    };

    onNewEventsListener = function (info) {};

    // general events errors
    overwolf.games.events.onError.addListener(onErrorListener);

    // "static" data changed (total kills, username, steam-id)
    // This will also be triggered the first time we register
    // for events and will contain all the current information
    overwolf.games.launchers.events.onInfoUpdates.addListener(
      onInfoUpdates2Listener
    );
    // an event triggerd
    overwolf.games.events.onNewEvents.addListener(onNewEventsListener);
  }

  function unregisterEvents() {
    overwolf.games.events.onError.removeListener(onErrorListener);
    overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener);
    overwolf.games.events.onNewEvents.removeListener(onNewEventsListener);
  }

  function launcherRunning(launcherInfo) {
    if (!launcherInfo) {
      return false;
    }

    if (!launcherInfo.launchers[0]) {
      return false;
    }

    // NOTE: we divide by 10 to get the launcher class id without it's sequence number
    if (Math.floor(launcherInfo.launchers[0].id / 10) != 10902) {
      return false;
    }

    return true;
  }

  function setFeatures() {
    overwolf.games.launchers.events.setRequiredFeatures(
      10902,
      g_interestedInFeatures,
      function (info) {
        if (info.status == "error") {
          //
          //
          window.setTimeout(setFeatures, 2000);
          return;
        }
      }
    );
  }

  // Start here
  overwolf.games.launchers.onLaunched.addListener(function () {
    registerEvents();
    setTimeout(setFeatures, 1000);
  });

  overwolf.games.launchers.getRunningLaunchersInfo(function (res) {
    if (launcherRunning(res)) {
      unregisterEvents();
      registerEvents();
      setTimeout(setFeatures, 1000);
    }
  });

  overwolf.games.launchers.onTerminated.addListener(function (res) {});
};
