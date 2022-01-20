class MemoryHUD {
  constructor() {
    // Templates
    this.cardTemplate = document.getElementById('Card');

    // Grille de jeu
    this.boardContainer = document.getElementById('Board');

    // Tableau des scores    
		this.leaderboardContainer = document.getElementById('Leaderboard');

    // Cartes retournées
    this.flippedCardsSpan = document.querySelector(':scope #moves span');
  }

	/**
	 * Actualise le nombre de cartes retournées au court de la partie en cours.
	 *
	 * @param flippedCards
	 */
	setFlippedCards(flippedCards) {
		this.flippedCardsSpan.innerHTML = flippedCards;
	}

	/**
	 * Masque le tableau des scores.
	 */
	hideLeaderboard() {
		this.leaderboardContainer.classList.add('Leaderboard--hidden');
	}

	/**
	 * Supprime la classe CSS responsable d'une opacité à 0 sur
	 * le tableau des scores.
	 */
   vanishLeaderboard() {
		this.leaderboardContainer.classList.add('Leaderboard--vanish');
	}

	/**
	 * Applique une classe CSS responsable d'une opacité à 0 sur
	 * la grille de jeu.
	 */
	vanishBoard() {
		this.boardContainer.classList.add('Board--vanish');
	}

	/**
	 * Supprime la classe CSS responsable d'une opacité à 0 sur
	 * la grille de jeu.
	 */
	appearBoard() {
		this.boardContainer.classList.remove('Board--vanish');
	}
}

module.exports = MemoryHUD;
