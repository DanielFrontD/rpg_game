const { DEFAULT_USER_INDICATOR } = require("./constants");

module.exports = {
  questionAsync: (rl) =>
    new Promise((resolve, reject) => {
      rl.question(`${DEFAULT_USER_INDICATOR} `, (answer) => {
        resolve(answer);
      });
    }),
};
