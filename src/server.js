const dgram = require('node:dgram');
const logger = require("./config/logger")

function createServer() {
  const server = dgram.createSocket('udp4');

  server.on("connect", () => {
    logger.info("conneced");
  })

  server.on('message', (msg, rinfo) => {
    logger.info(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });

  server.on('listening', () => {
    const address = server.address();
    logger.info(`server listening ${address.address}:${address.port}`);
  });

  return server;
}

function startServer(port) {
  logger.info("starting server");
  const server = createServer()
  server.bind(port);

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      logger.error('Address in use, retrying...');
      setTimeout(() => {
        startServer(port);
      }, 1000);
    }
  });

  return Promise.resolve(server);
}

module.exports = {
  startServer
}