// La class Controller nous servira de base commune
// pour tous nos éventuels controllers.

class Controller {
  constructor(req, res) {
    // On vient stocker dans la nouvelle instance de notre class
    // la requête (req / request) et la réponse (res / response)
    // qu'express nous communique au passage dans une route.
    this.req = req;
    this.res = res;
  }

  sendView(viewName, variables = {}) {
    this.res.render(viewName, variables);
  }
}

module.exports = Controller;
