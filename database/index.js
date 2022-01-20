// On récupère sequelize à partir du module "sequelize"
const { Sequelize } = require('sequelize');

// On vient l'instancier avec les informations de connexion,
// stockées dans notre fichier .env
//
// /!\ Attention !
// Le fichier .env.example ne doit pas comporter les informations de connexion,
// il sert uniquement de modèle !
// Il est important de conserver ces informations en sécurité, sans quoi
// votre application pourrait être vulnérable.
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: process.env.DBHOST,
    dialect: process.env.DBTYPE,
  }
);

module.exports = sequelize;