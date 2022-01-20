class MemoryHUD {
  constructor() {
    // Templates
    this.cardTemplate = document.getElementById('Card');
		this.gameResultsTemplate = document.getElementById('GameResults');

		// Résultats de fin de partie
		this.gameResultsContainer = null;

    // Grille de jeu
    this.boardContainer = document.getElementById('Board');

    // Tableau des scores    
		this.leaderboardContainer = document.getElementById('Leaderboard');

    // Cartes retournées
    this.flippedCardsSpan = document.querySelector(':scope #moves span');

    // Temps écoulé
    this.elapsedTimeSpan = document.querySelector(':scope #elapsedTime span');
		this.elapsedTimeProgressBar = document.querySelector(':scope #elapsedTime .ProgressBar');
  }

	/**
	 * Retourne un pourcentage (sous forme de chaîne de caractères)
   * correspondant au temps écoulé.
	 * 
   * Exemple : 46%
	 *
	 * @returns {string}
	 */
	formatElapsedTimeIntoPercent(elapsedTime, maxSecondsPerGame) {
		return `${(elapsedTime / maxSecondsPerGame) * 100}%`;
	}

	/**
	 * Retourne le temps écoulé sous le format "M:SS".
   * 
	 * Exemple : 4:06
	 *
	 * @returns {string}
	 */
	formatElapsedTime(elapsedTime) {
		const seconds = (elapsedTime % 60 < 10) ? `0${elapsedTime % 60}` : elapsedTime % 60;
		const minutes = Math.floor(elapsedTime / 60);

		return `${minutes}:${seconds}`;
	}

	/**
	 * Actualise les données relatives au temps écoulé sur le HUD.
	 *
	 * @param elapsedTime
	 */
	setElapsedTime(elapsedTime, maxSecondsPerGame) {
		this.elapsedTimeSpan.innerHTML = this.formatElapsedTime(elapsedTime);
    this.elapsedTimeProgressBar.style.setProperty('--width', this.formatElapsedTimeIntoPercent(elapsedTime, maxSecondsPerGame));
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
	 * Supprime du DOM le paragraphe et le formulaire de soumission de score
	 * de la fenêtre modale des résultats.
	 */
	hideResultsForm() {
		this.gameResultsContainer.querySelector('p.onlyIfWon').outerHTML = '';
		this.gameResultsContainer.querySelector('form').outerHTML = '';
	}

	/**
	 * Affiche et paramètre la fenêtre modale des résultats de fin de partie.
	 * @param flippedCards
	 * @param foundPairs
	 * @param fruitsPerGame
	 * @param elapsedTime
	 */
  displayResults(
		flippedCards,
		foundPairs,
		fruitsPerGame,
		elapsedTime
  ) {
		// On clone le template de l'écran de fin de partie...
		this.gameResultsContainer = document.importNode(this.gameResultsTemplate.content, true).querySelector('section');

		// ... puis on modifie les données affichée par les données actuelles.
		this.gameResultsContainer.querySelector('#GameResultsMoves').innerHTML = flippedCards;
		this.gameResultsContainer.querySelector('#GameResultsFound').innerHTML = foundPairs;
		this.gameResultsContainer.querySelector('#GameResultsPairs').innerHTML = fruitsPerGame;
		this.gameResultsContainer.querySelector('#GameResultsElapsedTime').innerHTML = this.formatElapsedTime(elapsedTime);

		// Si une ou plusieurs paires n'ont pas été trouvées durant la partie...
		if (foundPairs !== fruitsPerGame) {
			// ... alors on supprime le paragraphe proposant à l'utilisateur
			// d'envoyer son score, ainsi que le formulaire.
			this.hideResultsForm();
		}

		// Puis au bout d'une seconde...
		setTimeout(() => {
			// ... on rétabli l'opacité de la fenêtre modale grâce à la classe CSS `GameResults--visible`.
			this.gameResultsContainer.classList.add('GameResults--visible');
		}, 1000);

    // On insert l'écran des résultats dans le DOM.
		document.body.append(this.gameResultsContainer);
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
	 * Floute la grille de jeu.
	 */
	blurBoard() {
		this.boardContainer.classList.add('Board--blurred');
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
