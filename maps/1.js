const { parseMap } = require("./parse-map");

const mapString = `\
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
════════════════════════╗~~~
X                       ║~~~
═══╗                    ║~~~
~~~║                    ║~~~
~~~║                    ╚═══
~~~║
~~~╚════════════════════════
~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

module.exports = parseMap(mapString);
