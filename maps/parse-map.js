function parseMap(mapString) {
  const rows = mapString
    .split("\n")
    .filter((line) => line.length > 0);

  const maxWidth = Math.max(...rows.map((row) => row.length));

  return rows.map((line) => {
    const chars = line.split("");
    while (chars.length < maxWidth) {
      chars.push(" ");
    }
    return chars;
  });
}

module.exports = { parseMap };
