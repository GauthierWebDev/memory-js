// On paramètre en avance le comportement de notre logger
const loggerParams = {
  logFilePath: 'logs/memory.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss',
};

// On vient ensuite l'instancier avec les paramètres que nous avons défini plus tôt
const logger = require('simple-node-logger').createSimpleLogger(loggerParams);

module.exports = logger;