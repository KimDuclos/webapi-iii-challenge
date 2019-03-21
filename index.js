require('dotenv').config();

const server = require('./api/server.js');

// make the port dynamic
const port = process.env.PORT || 4000;
const greeting = process.env.GREETING;
server.listen(port, () => {
  console.log(`\n*** ${greeting} http://localhost:${port} ***\n`);
});