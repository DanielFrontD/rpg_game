const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

connection.connect((error) => {
  if (error) {
    console.error("Error on connect DB", error);
    return;
  }
});

module.exports = {
  query: async (sql, valores, callback) => {
    await connection.query('USE rpg_game_db');

    return connection.query(sql, valores, callback);
  },
};
