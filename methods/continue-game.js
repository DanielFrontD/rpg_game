const { questionAsync } = require("../shared/utils");
const { COLORS } = require("../shared/constants");
const { getPlayers, getFullPlayerData } = require("../db/db-utils");
const { Player } = require("../classes/player");
const { createMap } = require("./draw-map");

async function continueGame(readlineProccess) {
  console.clear();

  const players = await getPlayers();

  if (players.length === 0) {
    console.log(`${COLORS.YELLOW}No hay partidas guardadas.${COLORS.RESET}`);
    console.log(`${COLORS.CYAN}Presiona cualquier tecla para volver al menú.${COLORS.RESET}`);
    return null;
  }

  console.log(`${COLORS.GREEN}Selecciona tu partida:${COLORS.RESET}`);
  console.log("");

  players.forEach((player, index) => {
    console.log(
      `${COLORS.CYAN}${index + 1}.${COLORS.RESET} ${COLORS.BOLD}${player.userName}${COLORS.RESET} - ${player.characterClass} (Nivel ${player.level})`
    );
  });

  console.log("");
  const selection = await questionAsync(readlineProccess);
  const selectedIndex = parseInt(selection) - 1;
  const selectedPlayer = players[selectedIndex];

  if (!selectedPlayer) {
    console.log(`${COLORS.RED}Opción inválida.${COLORS.RESET}`);
    return continueGame(readlineProccess);
  }

  const fullPlayerData = await getFullPlayerData(selectedPlayer.playerId);
  const player = new Player(fullPlayerData[0]);

  console.clear();
  console.log(
    `${COLORS.GREEN}Bienvenido de vuelta, ${player.userName}!${COLORS.RESET}`
  );
  console.log(`${COLORS.CYAN}Presiona cualquier tecla para continuar${COLORS.RESET}`);

  function startGame() {
    createMap(player.lastMap);
    readlineProccess.input.removeListener("keypress", startGame);
  }

  readlineProccess.input.on("keypress", startGame);
}

module.exports = { continueGame };
