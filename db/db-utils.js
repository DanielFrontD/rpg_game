const db = require("./db-connection");

async function createUser(name) {
  const createdUser = await db.query(
    "INSERT INTO users (user_name) VALUES (?)",
    [name]
  );

  return createdUser;
}

async function getCharacters() {
  try {
    const characters = await db.query("SELECT * FROM characters");

    return characters;
  } catch (error) {
    console.error("Error on get the characters", error);

    throw error;
  }
}

async function saveUserCharacter(userId, characterId) {
  try {
    const createdUser = await db.query(
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
    const createdUser = await db.query(
      `SELECT pl.player_id AS playerId,
      u.user_name AS userName,
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

async function getPlayers() {
  const players = await db.query(
    `SELECT pl.player_id AS playerId,
    u.user_name AS userName,
    c.character_name AS characterClass,
    pl.player_level AS level
    FROM players AS pl
    JOIN users AS u ON pl.player_user_id = u.user_id
    JOIN characters AS c ON pl.player_character_id = c.character_id`
  );

  return players;
}

async function updatePlayerMap(playerId, mapNumber, lastPosition) {
  await db.query(
    "UPDATE players SET player_last_map = ?, player_last_position = ? WHERE player_id = ?",
    [mapNumber, lastPosition, playerId]
  );
}

module.exports = {
  createUser,
  getCharacters,
  saveUserCharacter,
  getFullPlayerData,
  getPlayers,
  updatePlayerMap,
};
