// loads the .env environment variables
require('dotenv').config();
// connect to mongo
require('./lib/connect')('mongodb://heroku_1zlqzd9z:ra6pjkrb7m53t9md464448ikgk@ds227808.mlab.com:27808/heroku_1zlqzd9z');

// require the app http event handler
const app = require('./lib/app');
// create an http server that uses app
const { createServer } = require('http');
const server = createServer(app);

// start the server by listening on a port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});