const GlobalController = require("../controllers/Global");
const ScoreController = require("../controllers/Score");

// Chacune de nos routes appelleront des méthodes de nos controllers,
// après avoir fait une nouvelle instance (`new GlobalController(req, res)` par exemple).
// Dans le constructeur de nos controllers, on souhaite attribuer des propriétés selon
// deux informations fournies à l'instanciation :
// - La requête (req)
// - La réponse (res)
// On n'oublie donc pas de les fournir !

const routes = (app) => {
	// Cette première route retournera la vue de notre application.
	app.get('/', (req, res) => new GlobalController(req, res).sendHome());
	// Celle-ci est un endpoint pour notre API.
	// Elle permet l'enregistrement de nouveaux scores.
	app.post('/scoreSubmit', (req, res) => new ScoreController(req, res).scoreSubmit());
};

module.exports = routes;
