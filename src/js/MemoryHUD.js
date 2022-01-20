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
	 * @param newGameHandler
	 * @param submitScore
	 * @param displayLeaderboardHandler
	 */
  displayResults(
		flippedCards,
		foundPairs,
		fruitsPerGame,
		elapsedTime,
		newGameHandler,
		submitScore,
		displayLeaderboardHandler
  ) {
		// On clone le template de l'écran de fin de partie...
		this.gameResultsContainer = document.importNode(this.gameResultsTemplate.content, true).querySelector('section');

		// ... puis on modifie les données affichées par les données actuelles.
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
		else {
			// Si toutes les paires ont été trouvées, on ajoute un écouteur d'événement `submit` sur le formulaire...
			this.gameResultsContainer.querySelector('form').addEventListener('submit', (event) => {
				// ... qui bloquera le fonctionnement par défaut du `submit` sur ce formulaire...
				event.preventDefault();
				// ... et appellera la méthode de soumission des résultats, par le biais du callback `submitScore`.
				submitScore(document.getElementById('username').value);
			})
		}

		// On ajoute un écouteur d'événement `click` sur le bouton de la fenêtre modale,
		// qui actionnera une méthode propre au démarrage d'une nouvelle partie lorsque
		// ce bouton sera cliqué (pour masquer la fenêtre modale et gérer d'autres animations).
		this.gameResultsContainer
			.querySelector('button[data-action="new-game"]')
			.addEventListener('click', () => newGameHandler());

    // On fait exactement la même chose pour le bouton qui est prévu pour afficher
    // le tableau des scores
    this.gameResultsContainer
      .querySelector('button[data-action="leaderboard"]')
      .addEventListener('click', () => displayLeaderboardHandler());

		// Puis au bout d'une seconde...
		setTimeout(() => {
			// ... on rétabli l'opacité de la fenêtre modale grâce à la classe CSS `GameResults--visible`.
			this.gameResultsContainer.classList.add('GameResults--visible');
		}, 1000);

    // On insert l'écran des résultats dans le DOM.
		document.body.append(this.gameResultsContainer);
  }

	/**
	 * Fait disparaître la fenêtre modale de fin de partie.
	 */
	vanishResults() {
		this.gameResultsContainer.classList.remove('GameResults--visible');
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
