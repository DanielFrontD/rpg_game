const readline = require("readline");
const {
  VERTICAL_WALL,
  BOTTOM_RIGHT_WALL,
  HORIZONTAL_WALL,
  TOP_RIGHT_WALL,
  TOP_LEFT_WALL,
  BOTTOM_LEFT_WALL,
} = require("../shared/constants");

const rows = 6;
const columns = 20;
const rightLimit = columns - 1;
const bottomLimit = rows - 1;
const player = "🧝";

let x = 1;
let y = 1;

function replaceAt(value, index, replacement) {
  return (
    value.substring(0, index) +
    replacement +
    value.substring(index + replacement.length)
  );
}

function printMap() {
  for (let row = 0; row < rows; row++) {
    let line = "";
    let horizontaWall = "";

    for (let column = 0; column < columns; column++) {
      if (row === y && column === x) {
        line += player;
      } else {
        const endLimit = column === rightLimit;
        const firstOrEnd = column === 0 || endLimit;

        if (row === 0 && column === 0) {
          horizontaWall += TOP_LEFT_WALL;
        }

        if (row === 0 && column !== 0) {
          horizontaWall +=
            line.length === columns ? `${HORIZONTAL_WALL}${TOP_RIGHT_WALL}` : HORIZONTAL_WALL;
        }

        if (row === bottomLimit) {
          horizontaWall +=
            column === 0
              ? `${BOTTOM_LEFT_WALL}${HORIZONTAL_WALL}`
              : endLimit
              ? BOTTOM_RIGHT_WALL
              : HORIZONTAL_WALL;
        } else {
          const lineHasPlayer = line.includes(player);

          if (firstOrEnd) {
            line += VERTICAL_WALL;
          }

          line += " ";

          if (lineHasPlayer && endLimit) {
            line = line.replace(` ${VERTICAL_WALL}`, VERTICAL_WALL);
          }
        }
      }
    }

    if (horizontaWall) {
      console.log(horizontaWall);
    }

    console.log(line);
  }
}

function movePlayer(xPosition, yPosition) {
  if (x + xPosition >= 1 && x + xPosition < columns - 2) {
    x += xPosition;
  }

  if (y + yPosition >= 1 && y + yPosition < bottomLimit) {
    y += yPosition;
  }
}

async function handleKeyboard() {
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

    switch (data.name) {
      case "right":
        movePlayer(1, 0);
        break;
      case "left":
        movePlayer(-1, 0);
        break;
      case "up":
        movePlayer(0, -1);
        break;
      case "down":
        movePlayer(0, 1);
        break;
    }

    console.clear();
    printMap();
  });

  readlineProccess.prompt();
}

function createMap() {
  console.clear();
  printMap();
  handleKeyboard();
}

module.exports = { createMap };
