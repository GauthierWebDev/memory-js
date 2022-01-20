const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../database');

class Score extends Model {};

Score.init({
	username: {
    // On met une limite de 16 caractères
    // pour le nom d'utilisateur.
		type: Sequelize.STRING(16),
		allowNull: false,
    // On met une chaîne de caractères
    // comme valeur par défaut.
		defaultValue: 'Anonyme',
	},
	elapsedTime: {
    // Format de sortie : HH:MM:SS
		type: Sequelize.TIME,
		allowNull: false,
	},
	finishedAt: {
		type: Sequelize.DATE,
		allowNull: false,
	},
}, { sequelize, modelName: 'score' });

module.exports = Score;
