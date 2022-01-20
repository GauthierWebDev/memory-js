const GlobalController = require("../controllers/Global");

const routes = (app) => {
	// Cette première route retournera la vue de notre application.
	app.get('/', (req, res) => new GlobalController(req, res).sendHome());
};

module.exports = routes;
