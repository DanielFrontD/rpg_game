const { questionAsync } = require("../shared/utils");
const { COLORS } = require("../shared/constants");
const {
  createUser,
  getCharacters,
  saveUserCharacter,
  getFullPlayerData,
} = require("../db/db-utils");

async function askForName(readlineProccess) {
  console.log(`${COLORS.CYAN}Cual sera tu nombre?${COLORS.RESET}`);

  const nameResponse = await questionAsync(readlineProccess);

  if (!nameResponse.trim()) {
    console.log(`${COLORS.RED}El nombre no puede estar vacío.${COLORS.RESET}`);
    console.log("");
    return askForName(readlineProccess);
  }

  try {
    const currentUser = await createUser(nameResponse);
    return { name: nameResponse, user: currentUser };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log(`${COLORS.RED}El nombre "${nameResponse}" ya existe. Escoge otro nombre.${COLORS.RESET}`);
      console.log("");
      return askForName(readlineProccess);
    }
    throw error;
  }
}

const createPlayer = (readlineProccess) =>
  new Promise(async (resolve, reject) => {
    console.clear();

    try {
      const { name: nameResponse, user: currentUser } = await askForName(readlineProccess);

      console.log(`${COLORS.GREEN}${nameResponse}! Tu aventura ya casi comienza.${COLORS.RESET}`);
      console.log(`${COLORS.YELLOW}Escoge tu personaje!${COLORS.RESET}`);

      const characters = await getCharacters();

      characters.map((character, index) => {
        console.log(`${COLORS.BOLD}${index + 1}: ${character.character_name}:${COLORS.RESET}`);
        console.log(
          `   ${COLORS.RED}ACT ${character.character_attack}${COLORS.RESET} ${COLORS.BLUE}MAG ${character.character_magic}${COLORS.RESET} ${COLORS.GREEN}HP ${character.character_healt_points}${COLORS.RESET} ${COLORS.MAGENTA}MP ${character.character_magic_points}${COLORS.RESET}`
        );
      });

      const characterNumber = await questionAsync(readlineProccess);
      const index = characterNumber - 1;
      const selectedCharacter = characters[index];

      if (selectedCharacter) {
        console.clear();

        const savedUserCharacter = await saveUserCharacter(
          currentUser.insertId,
          selectedCharacter.character_id
        );

        if (savedUserCharacter) {
          const fullPlayerData = await getFullPlayerData(
            savedUserCharacter.insertId
          );

          resolve(fullPlayerData);
        }
      }
    } catch (error) {
      reject(error);
    }
  });

module.exports = { createPlayer };
