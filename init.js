const readline = require("readline");
const newGame = require("./methods/new-game");
const { questionAsync } = require("./shared/utils");

const readlineProccess = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function listOptions() {
  console.log("1. Nuevo Juego");
  console.log("2. Continuar");
  console.log("3. Opciones");
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
      const response = await newGame(readlineProccess);

      if (response) {
        readlineProccess.close();
        process.exit(0);
      }

      return true;
    case "2":
      console.log("Ha seleccionado la Opción 2");

      return true;
    case "3":
      console.log("Ha seleccionado la Opción 3");

      return true;
    default:
      console.log("Opción inválida. Por favor, seleccione una opción válida.");

      initGame(true);

      return false;
  }
}

async function initGame(retry) {
  showMenu(retry);

  const selectedOption = await questionAsync(readlineProccess);

  selectMenuOption(selectedOption);
}

initGame();
