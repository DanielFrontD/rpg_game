const { createPlayer } = require("./create-player");
const { Player } = require("../classes/player");
const { createMap } = require("./draw-map");

async function newGame(readlineProccess) {
  const playerData = await createPlayer(readlineProccess);
  const newPlayer = new Player(playerData[0]);

  console.log(
    `Eres un ${newPlayer.characterClass}, y por algún motivo desconocido apareciste en un cuarto vacío.`
  );
  console.log("Solo te queda buscar la salida cueste lo que cueste!");
  console.log("");
  console.log("Presiona cualquier tecla para empezar");

  function startGame() {
    createMap(newPlayer.lastMap);

    readlineProccess.input.removeListener("keypress", startGame);
  }

  readlineProccess.input.on("keypress", startGame);
}

module.exports = { newGame };
