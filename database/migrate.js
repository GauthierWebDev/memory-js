// On n'oublie pas d'importer nos variables d'environnement
// stockées dans notre fichier .env
require('dotenv').config();

// On va mettre un peu de couleur dans ce terminal tout gris
// avec notre fidèle chalk !
const chalk = require('chalk');

// On prend notre logger pour stocker les informations liées
// aux opérations effectuées dans ce fichier.
const logger = require('../logs');

// On crée notre model Score.
require('../models/Score');

// On récupère l'instance de sequelize qui est utilisée
// pour la création de notre model Score.
const sequelize = require('./index');

// Et bam ! On lance la synchronisation, qui est en charge de
// créer les tables et colonnes selon les modèles crées par
// cette même instance de Sequelize.
sequelize.sync()
	.then(() => {
		console.log(chalk.green('Toutes les migrations ont été faites !'));
	})
	.catch((error) => {
		console.error(chalk.red('[ERROR] Une ou plusieurs migration(s) n\'ont pas pu être réalisée(s).'));
		logger.error(error);
	});
