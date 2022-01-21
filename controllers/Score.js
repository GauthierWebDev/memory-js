const Controller = require('./Controller');
const ScoreService = require('../services/ScoreService');

class ScoreController extends Controller {
  constructor(req, res) {
    super(req, res);
  }

  async scoreSubmit() {
    const { username, elapsedTime, finishedAt } = this.req.body;
    await ScoreService.insertScore(username, elapsedTime, finishedAt);
    const scores = await ScoreService.retrieveScores();

    this.res.json({ scores });
  }
}

module.exports = ScoreController;
