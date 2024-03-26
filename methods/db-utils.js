const db = require("./db-connection");
const { promisify } = require("util");

const asyncRequest = promisify(db.query).bind(db);

async function createUser(name) {
  try {
    const createdUser = await asyncRequest(
      "INSERT INTO users (user_name) VALUES (?)",
      [name]
    );

    return createdUser;
  } catch (error) {
    console.error("Error on create the user", error);

    throw error;
  }
}

async function getCharacters() {
  try {
    const characters = await asyncRequest("SELECT * FROM characters");

    return characters;
  } catch (error) {
    console.error("Error on get the characters", error);

    throw error;
  }
}

async function saveUserCharacter(userId, characterId) {
  try {
    const createdUser = await asyncRequest(
      "INSERT INTO users_characters (users_characters_user_id, users_characters_character_id, users_characters_level) VALUES (?, ?, ?)",
      [userId, characterId, 1]
    );

    return createdUser;
  } catch (error) {
    console.error("Error on create the user", error);

    throw error;
  }
}

module.exports = { createUser, getCharacters, saveUserCharacter };
