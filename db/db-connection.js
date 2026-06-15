const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "rpg_game_db",
});

connection.connect((error) => {
  if (error) {
    console.error("Error on connect DB", error);
    return;
  }
});

module.exports = {
  query: (sql, valores) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, valores, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};
