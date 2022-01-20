class MemoryHUD {
  constructor() {
    // Templates
    this.cardTemplate = document.getElementById('Card');

    // Grille de jeu
    this.boardContainer = document.getElementById('Board');

    // Tableau des scores    
		this.leaderboardContainer = document.getElementById('Leaderboard');
  }

	/**
	 * Supprime la classe CSS responsable d'une opacité à 0 sur
	 * le tableau des scores.
	 */
   vanishLeaderboard() {
		this.leaderboardContainer.classList.add('Leaderboard--vanish');
	}
}

module.exports = MemoryHUD;
