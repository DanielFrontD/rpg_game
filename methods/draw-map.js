const readline = require("readline");
const {
  STARTING_POINT,
  ELF,
  NOT_AVAILABLE_SPACE,
  EXIT_FORWARD,
  EXIT_BACKWARD,
  COLORS,
} = require("../shared/constants");
const maps = require("../maps");
const { updatePlayerMap } = require("../db/db-utils");

let currentPlayerPosition = [null, null];
let playerStarted = false;
let currentMap = null;
let currentMapIndex = 0;
let keyboardHandler = null;
let currentPlayerId = null;

function printMap(mapIndex) {
  const rows = maps[mapIndex];
  currentMap = maps[mapIndex];

  for (let row = 0; row < rows.length; row++) {
    const columns = rows[row];
    let line = "";
    let skipNext = false;

    for (let column = 0; column < columns.length; column++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const currentColumn = columns[column];
      const playerPlaced =
        currentPlayerPosition[0] === row && currentPlayerPosition[1] === column;

      switch (true) {
        case playerPlaced: {
          line += ELF;
          skipNext = true;
          break;
        }

        case currentColumn === STARTING_POINT: {
          if (!playerStarted) {
            line += ELF;
            skipNext = true;
            currentPlayerPosition = [row, column];
          } else {
            line += " ";
          }
          break;
        }

        case currentColumn === EXIT_FORWARD: {
          line += " ";
          break;
        }

        case currentColumn === EXIT_BACKWARD: {
          line += " ";
          break;
        }

        default:
          if (currentColumn === NOT_AVAILABLE_SPACE) {
            line += `${COLORS.BLUE}${currentColumn}${COLORS.RESET}`;
          } else {
            line += currentColumn;
          }
      }
    }

    console.log(line);
  }
}

function isExit(yPosition, xPosition) {
  const tile = currentMap[yPosition] && currentMap[yPosition][xPosition];
  return tile === EXIT_FORWARD || tile === EXIT_BACKWARD;
}

function handleExit(yPosition, xPosition) {
  const tile = currentMap[yPosition][xPosition];

  if (tile === EXIT_FORWARD) {
    const nextMapIndex = currentMapIndex + 1;

    if (nextMapIndex < maps.length) {
      currentMapIndex = nextMapIndex;
      playerStarted = false;
      currentPlayerPosition = [null, null];

      const newMap = maps[currentMapIndex];
      for (let r = 0; r < newMap.length; r++) {
        for (let c = 0; c < newMap[r].length; c++) {
          if (newMap[r][c] === EXIT_BACKWARD) {
            currentPlayerPosition = [r, c];
            playerStarted = true;
            break;
          }
        }
        if (currentPlayerPosition[0] !== null) break;
      }

      if (currentPlayerId) {
        updatePlayerMap(currentPlayerId, currentMapIndex + 1, 0);
      }

      console.clear();
      printMap(currentMapIndex);
      return true;
    }
  }

  if (tile === EXIT_BACKWARD) {
    const prevMapIndex = currentMapIndex - 1;

    if (prevMapIndex >= 0) {
      currentMapIndex = prevMapIndex;
      playerStarted = true;

      const newMap = maps[currentMapIndex];
      currentPlayerPosition = [null, null];
      for (let r = 0; r < newMap.length; r++) {
        for (let c = 0; c < newMap[r].length; c++) {
          if (newMap[r][c] === EXIT_FORWARD) {
            currentPlayerPosition = [r, c];
            break;
          }
        }
        if (currentPlayerPosition[0] !== null) break;
      }

      if (currentPlayerId) {
        updatePlayerMap(currentPlayerId, currentMapIndex + 1, 1);
      }

      console.clear();
      printMap(currentMapIndex);
      return true;
    }
  }

  return false;
}

const nextSpotIsObstacle = (yPosition, xPosition) => {
  const tile = currentMap[yPosition] && currentMap[yPosition][xPosition];
  return tile !== " " && tile !== EXIT_FORWARD && tile !== EXIT_BACKWARD;
};

function movePlayer(nextMove) {
  playerStarted = true;
  const rightLimits = currentMap[0].length;

  switch (nextMove) {
    case "up": {
      const xPosition = currentPlayerPosition[1];
      const yPosition = currentPlayerPosition[0] - 1;

      if (yPosition < 0) return;
      if (isExit(yPosition, xPosition)) {
        handleExit(yPosition, xPosition);
        return;
      }
      if (nextSpotIsObstacle(yPosition, xPosition)) return;

      currentPlayerPosition = [yPosition, xPosition];
      break;
    }

    case "right": {
      const xPosition = currentPlayerPosition[1] + 1;
      const yPosition = currentPlayerPosition[0];

      if (xPosition >= rightLimits) return;
      if (isExit(yPosition, xPosition)) {
        handleExit(yPosition, xPosition);
        return;
      }
      if (nextSpotIsObstacle(yPosition, xPosition)) return;
      if (xPosition + 1 < rightLimits && nextSpotIsObstacle(yPosition, xPosition + 1) && !isExit(yPosition, xPosition + 1)) return;

      currentPlayerPosition = [yPosition, xPosition];
      break;
    }

    case "down": {
      const xPosition = currentPlayerPosition[1];
      const yPosition = currentPlayerPosition[0] + 1;

      if (yPosition >= currentMap.length) return;
      if (isExit(yPosition, xPosition)) {
        handleExit(yPosition, xPosition);
        return;
      }
      if (nextSpotIsObstacle(yPosition, xPosition)) return;

      currentPlayerPosition = [yPosition, xPosition];
      break;
    }

    case "left": {
      const xPosition = currentPlayerPosition[1] - 1;
      const yPosition = currentPlayerPosition[0];

      if (xPosition < 0) return;
      if (isExit(yPosition, xPosition)) {
        handleExit(yPosition, xPosition);
        return;
      }
      if (nextSpotIsObstacle(yPosition, xPosition)) return;

      currentPlayerPosition = [yPosition, xPosition];
      break;
    }

    default:
      return;
  }
}

function handleKeyboard(mapIndex) {
  const readlineProccess = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  keyboardHandler = readlineProccess;

  readlineProccess.input.setRawMode(true);
  readlineProccess.input.on("keypress", (key, data) => {
    if (data && data.ctrl && data.name === "c") {
      readlineProccess.close();
      process.exit();
    }

    movePlayer(data.name);

    console.clear();
    printMap(currentMapIndex);
  });

  readlineProccess.prompt();
}

function createMap(mapLevel = 0, playerId = null, lastPosition = 0) {
  const mapIndex = mapLevel > 0 ? mapLevel - 1 : 0;
  currentMapIndex = mapIndex;
  currentPlayerId = playerId;

  const map = maps[mapIndex];
  const targetTile = Number(lastPosition) === 1 ? EXIT_FORWARD : (mapIndex === 0 ? STARTING_POINT : EXIT_BACKWARD);

  currentPlayerPosition = [null, null];
  playerStarted = mapIndex > 0 || Number(lastPosition) === 1;

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === targetTile) {
        currentPlayerPosition = [r, c];
        break;
      }
    }
    if (currentPlayerPosition[0] !== null) break;
  }

  console.clear();
  printMap(mapIndex);
  handleKeyboard(mapIndex);
}

module.exports = { createMap };
