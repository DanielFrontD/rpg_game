const readline = require("readline");
const { questionAsync } = require("./shared/utils");
const { newGame } = require("./methods/new-game");

const readlineProccess = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function listOptions() {
  console.log("1. Nuevo Juego");
  console.log("2. Continuar");
}

function showMenu(retry) {
  const headText = retry
    ? "Vuelve a intentarlo:"
    : "Bienvenido al Final Fantasy con presupuesto 0! Seleccione una opción:";

  console.log(headText);

  listOptions();
}

async function selectMenuOption(opcion) {
  switch (opcion) {
    case "1":
      newGame(readlineProccess);

      return true;
    case "2":
      return true;
    default:
      console.log("Opción inválida. Por favor, seleccione una opción válida.");

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