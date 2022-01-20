const Controller = require('./Controller');

class GlobalController extends Controller {
	constructor(req, res) {
		// Le mot-clé "super" nous sert à appeler des méthodes existantes dans l'objet parent,
		// ici "Controller".
		// Comme on ne spécifie pas quelle méthode nous intéresse (super.method(/* ... */)),
		// on accède alors au constructeur de Controller.
		//
		// Comme nous avons besoin de stocker les valeurs de req et res dans notre controller
		// GlobalController qui hérite de Controller, pas besoin de nous casser la tête à dupliquer
		// du code, autant piocher dans les méthodes que GlobalController hérite de Controller !
		//
		// => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/super
		super(req, res);
	}

	sendHome() {
		this.sendView('home');
	}
}

module.exports = GlobalController;
