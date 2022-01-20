// On importe le module `dotenv` puis on le configure
// => https://www.npmjs.com/package/dotenv
require('dotenv').config();

// Pour un terminal plus joli, on va utiliser chalk !
// => https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// Tant qu'on est sur de l'esthétique, on va aussi rajouter de l'ergonomie avec un logger.
// L'objectif du logger est de stocker des informations dans un fichier (généralement "quelquechose.log"),
// notamment des erreurs ou des avertissements.
// On utilisera le paquet simple-node-logger
// => https://www.npmjs.com/package/simple-node-logger
const logger = require('./logs');

// On prépare notre serveur avec express
const express = require('express');
const app = express();

// On défini le port utilisé par notre application selon le port spécifié
// dans le fichier .env.
// Si aucun port n'est trouvé/défini dans le fichier .env,
// on utilise le port 5000 (fallback).
const port = process.env.PORT || 5000;


// On démarre notre serveur après l'avoir configuré plus haut.
app.listen(port, () => {
  console.log(chalk.green(`Serveur démarré à l'adresse http://localhost:${port}`));
});
