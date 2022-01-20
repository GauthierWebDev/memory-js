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
}

module.exports = ScoreService;
