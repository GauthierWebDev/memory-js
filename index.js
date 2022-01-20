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

// On récupère notre instance déjà paramétrée de sequelize
const sequelize = require('./database');

// On vient créer une fonction pour tester la connexion à notre base de données
const tryConnection = async () => {
	// On essaye...
	try {
		// ... de nous connecter à la base de données
		await sequelize.authenticate();
		console.log(chalk.green('Connexion à la base de données : OK'));
	}
	// ... mais à la connexion, il y a eu un problème alors...
	catch (error) {
		// ... je mets un message dans le terminal...
		console.error(chalk.red('[ERROR] Connexion à la base de données : impossible'));
		// ... j'affiche l'erreur et je la stocke dans notre fichier de log...
		logger.error(error);
		// ... puis je retourne l'erreur qui sera utilisée dans le "then" (ligne 60)
		return error;
	}
};

// On paramètre notre serveur :
// 1. On précise le moteur de templating.
app.set('view engine', 'ejs');
// 2. On précise le dossier contenant nos vues.
app.set('views', 'views');
// 3. On permet le chargement du contenu de notre dossier assets dans nos vues (statique).
app.use(express.static(__dirname + '/assets'));
// 4. On permet le parsing des données JSON des requêtes à l'API.
app.use(express.json());
// 5. On permet le parsing des données dans les URL lors des requêtes à l'API.
app.use(express.urlencoded({extended: true}));

// On défini le port utilisé par notre application selon le port spécifié
// dans le fichier .env.
// Si aucun port n'est trouvé/défini dans le fichier .env,
// on utilise le port 5000 (fallback).
const port = process.env.PORT || 5000;

// On vient instancier nos routes.
require('./routes')(app);

// On vient maintenant tester la connexion à notre base de données.
tryConnection()
	.then((error) => {
		// Si on obtient une erreur durant notre tentative de connexion à la base de données...
		if (error) {
			// ... alors on averti que le serveur n'est pas démarré...
			console.error(chalk.red('[ERROR] Le serveur n\'a pas pu démarrer.'));
			// ... puis on sort de la méthode "then" sans exécuter la suite.
			return;
		}

		// Si tout va bien dans la connexion à notre base de données,
		// on démarre notre serveur après l'avoir configuré plus haut.
		app.listen(port, () => {
			console.log(chalk.green(`Serveur démarré à l'adresse http://localhost:${port}`));
		});
	});
