const { startServer } = require("./server");
const logger = require("./config/logger");


const accessMessageHandler = (msg) => {
  console.log(msg);
}

const messageHandler = (msg, rinfo) => {

  const msgString = msg.toString();
  const msgObject = JSON.parse(msgString);

  Object.assign(msgObject.nabla, { ip: rinfo.address, port: rinfo.port });
  //console.log(msgObject)
  // logger.info(`server got: ${msgString} from ${rinfo.address}:${rinfo.port}`);
}


startServer(messageHandler).then((server) => {
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Socket Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(`${error}`);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  // process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });
  // process.on('SIGHUP', () => { console.log("Bye bye SIGHUP!"); process.exit(); });
  process.on('SIGUSR2', () => {
    logger.info('SOCKET SIGUSR2 received');
    if (server) {
      server.close();
    }
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info('SOCKET SIGTERM received');
    if (server) {
      server.close();
    }
  });
});

