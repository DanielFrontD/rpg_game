const { questionAsync } = require("../shared/utils");
const { createUser, getCharacters, saveUserCharacter } = require("./db-utils");

module.exports = (readlineProccess) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(`Cual sera tu nombre?`);

      const nameResponse = await questionAsync(readlineProccess);
      const currentUser = await createUser(nameResponse);

      console.log(`${nameResponse}! Tu aventura ya casi comienza.`);
      console.log("Escoge tu personaje!");

      const characters = await getCharacters();

      characters.map((character, index) => {
        console.log(`${index + 1}: ${character.character_name}:`);
        console.log(
          `   ACT ${character.character_attack} MAG ${character.character_magic} HP ${character.character_healt_points} MP ${character.character_magic_points}`
        );
      });

      const characterNumber = await questionAsync(readlineProccess);
      const index = characterNumber - 1;
      const selectedCharacter = characters[index];

      if (selectedCharacter) {
        console.log(`Tu personaje es un ${selectedCharacter.character_name}`);

        const savedUserCharacter = await saveUserCharacter(
          currentUser.insertId,
          selectedCharacter.character_id
        );

        if (savedUserCharacter) {
          resolve(true);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
