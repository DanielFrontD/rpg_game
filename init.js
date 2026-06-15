const readline = require("readline");
const { questionAsync } = require("./shared/utils");
const { newGame } = require("./methods/new-game");
const { continueGame } = require("./methods/continue-game");
const { COLORS } = require("./shared/constants");

const readlineProccess = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function listOptions() {
  console.log(`${COLORS.CYAN}1.${COLORS.RESET} Nuevo Juego`);
  console.log(`${COLORS.CYAN}2.${COLORS.RESET} Continuar`);
}

function showMenu(retry) {
  const headText = retry
    ? `${COLORS.YELLOW}Vuelve a intentarlo:${COLORS.RESET}`
    : `${COLORS.GREEN}Bienvenido al Final Fantasy con presupuesto 0!${COLORS.RESET} Seleccione una opción:`;

  console.log(headText);

  listOptions();
}

async function selectMenuOption(opcion) {
  switch (opcion) {
    case "1":
      newGame(readlineProccess);

      return true;
    case "2":
      continueGame(readlineProccess);

      return true;
    default:
      console.log(`${COLORS.RED}Opción inválida. Por favor, seleccione una opción válida.${COLORS.RESET}`);

      initGame(true);

      return false;
  }
}

async function initGame(retry) {
  console.clear();
  showMenu(retry);

  const selectedOption = await questionAsync(readlineProccess);

  selectMenuOption(selectedOption);
}

initGame();