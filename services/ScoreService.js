const Score = require('../models/Score');
const sanitizer = require('sanitizer');
const logger = require('../logs');

class ScoreService {
	static async insertScore(username, elapsedTime, finishedAt) {
		try {
			await Score.create({
				// On s'assure qu'une fois trimé, le nom d'utilisateur fait entre 1 et 16 caractères (inclus).
				// Si c'est le cas, on le sauvegarde tel-quel.
				// Dans le cas contraire, on va utiliser la chaîne de caractères "Anonyme".
				//
				// On fait également attention au XSS en échappant la chaîne de caractères.
				// => https://developer.mozilla.org/fr/docs/Glossary/Cross-site_scripting
				username: (sanitizer.escape(username.trim()).length > 0 && sanitizer.escape(username.trim()).length <= 16)
					? sanitizer.escape(username.trim())
					: 'Anonyme',
				elapsedTime,
				finishedAt,
			});
		}
		catch (error) {
			console.error('[ERROR] La création d\'un nouveau score n\'a pas fonctionné');
			logger.error(error);
		}
	}

	static async retrieveScores(limit = 10) {
		try {
			// On souhaite récupérer les noms d'utilisateur, le temps écoulé
			// ainsi que les dates de fin de partie sur un échantillon maximal
			// de 10 scores enregistrés, en commençant par les scores ayant
			// un temps écoulé le plus court.
			//
			// Requête SQL :
			// 	SELECT `username`, `elapsedTime`, `finishedAt`
			// 	FROM `scores`
			// 	ORDER BY `elapsedTime`
			// 	LIMIT 10;
			const scores = await Score.findAll({
				attributes: ['username', 'elapsedTime', 'finishedAt'],
				limit,
				order: [
					[ 'elapsedTime', 'ASC' ],
				],
			});

			return scores;
		}
		catch (error) {
			console.error(chalk.red('[ERROR] Impossible de récupérer un échantillon de scores depuis la base de données.'));
			logger.error(error);

			return [];
		}
	}
}

module.exports = ScoreService;
