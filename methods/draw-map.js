const readline = require("readline");
const { STARTING_POINT, ELF } = require("../shared/constants");
const maps = require("../maps");

let currentPlayerPosition = [null, null];
let playerStarted = false;
let currentMap = null;

function printMap(mapLevel) {
  const rows = maps[mapLevel];
  currentMap = maps[mapLevel];

  for (let row = 0; row < rows.length; row++) {
    const columns = rows[row];
    let line = '';

    for (let column = 0; column < columns.length; column++) {
      const currentColumn = columns[column];
      const playerPlaced =
        currentPlayerPosition[0] === row && currentPlayerPosition[1] === column;

      switch (true) {
        case playerPlaced: {
          line += ELF;

          break;
        }

        case currentColumn === STARTING_POINT: {
          if (!playerStarted) {
            line += ELF;
            currentPlayerPosition = [row, column];
          } else {
            line += ' ';
          }

          break;
        }

        default:
          line += currentColumn;
      }
    }

    const playerIsInLine = line.includes(ELF);

    if (playerIsInLine) {
      line = line.replace(`${ELF} `, ELF)
    }
    console.log(line);
  }
}

const nextSpotIsObstacle = (yPosition, xPosition) => currentMap[yPosition][xPosition] !== ' ';

function movePlayer(nextMove) {
  playerStarted = true;
  const rightLimits = currentMap[0].length;
  const bottomLimits = currentMap.length - 1;

  console.log({ rightLimits })

  switch (nextMove) {
    case "up": {
      const xPosition = currentPlayerPosition[1];
      const yPosition = currentPlayerPosition[0] - 1;

      if (yPosition < 1 || nextSpotIsObstacle(yPosition, xPosition)) {
        return;
      }

      currentPlayerPosition = [yPosition, xPosition];

      break;
    }

    case "right": {
      const xPosition = currentPlayerPosition[1] + 1;
      const yPosition = currentPlayerPosition[0];

      if (xPosition === rightLimits || nextSpotIsObstacle(yPosition, xPosition + 1)) {
        return;
      }

      currentPlayerPosition = [yPosition, xPosition];

      break;
    }

    case "down": {
      const xPosition = currentPlayerPosition[1];
      const yPosition = currentPlayerPosition[0] + 1;

      if (yPosition === bottomLimits || nextSpotIsObstacle(yPosition, xPosition)) {
        return;
      }

      currentPlayerPosition = [yPosition, xPosition];

      break;
    }

    case "left": {
      const xPosition = currentPlayerPosition[1] - 1;
      const yPosition = currentPlayerPosition[0];

      if (xPosition < 0 || nextSpotIsObstacle(yPosition, xPosition)) {
        return;
      }

      currentPlayerPosition = [yPosition, xPosition];

      break;
    }

    default:
      return;
  }
}

async function handleKeyboard(mapLevel) {
  const readlineProccess = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readlineProccess.input.setRawMode(true);
  readlineProccess.input.on("keypress", (key, data) => {
    if (data && data.ctrl && data.name === "c") {
      readlineProccess.close();
      process.exit();
    }

    movePlayer(data.name);

    console.clear();

    printMap(mapLevel);
  });

  readlineProccess.prompt();
}

function createMap(mapLevel = 0) {
  console.clear();
  printMap(mapLevel);
  handleKeyboard(mapLevel);
}

module.exports = { createMap };
