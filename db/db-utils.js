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
      "INSERT INTO players (player_user_id, player_character_id, player_level, player_last_map) VALUES (?, ?, ?, ?)",
      [userId, characterId, 1, 1]
    );

    return createdUser;
  } catch (error) {
    console.error("Error on create the user", error);

    throw error;
  }
}

async function getFullPlayerData(playerId) {
  try {
    const createdUser = await asyncRequest(
      `SELECT u.user_name AS userName,
      c.character_name AS characterClass,
      c.character_attack AS attack,
      c.character_magic AS magic,
      c.character_healt_points AS hp,
      c.character_magic_points AS mp,
      pl.player_last_position AS lastPosition,
      pl.player_last_map AS lastMap,
      pl.player_level AS level
      FROM users AS u
      JOIN players AS pl ON u.user_id = pl.player_user_id
      JOIN characters AS c ON pl.player_character_id = c.character_id
      WHERE pl.player_id = ?`,
      [playerId]
    );

    return createdUser;
  } catch (error) {
    console.error("Error on create the user", error);

    throw error;
  }
}

module.exports = {
  createUser,
  getCharacters,
  saveUserCharacter,
  getFullPlayerData,
};
