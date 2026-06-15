const { createPlayer } = require("./create-player");
const { Player } = require("../classes/player");
const { createMap } = require("./draw-map");
const { COLORS } = require("../shared/constants");

async function newGame(readlineProccess) {
  const playerData = await createPlayer(readlineProccess);
  const newPlayer = new Player(playerData[0]);

  console.log(
    `${COLORS.YELLOW}Eres un ${newPlayer.characterClass}, y por algún motivo desconocido apareciste en un cuarto vacío.${COLORS.RESET}`
  );
  console.log(`${COLORS.YELLOW}Solo te queda buscar la salida cueste lo que cueste!${COLORS.RESET}`);
  console.log("");
  console.log(`${COLORS.CYAN}Presiona cualquier tecla para empezar${COLORS.RESET}`);

  function startGame() {
    createMap(newPlayer.lastMap);

    readlineProccess.input.removeListener("keypress", startGame);
  }

  readlineProccess.input.on("keypress", startGame);
}

module.exports = { newGame };
