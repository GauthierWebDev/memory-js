class Memory {
	constructor() {
		this.fruits = [];
	}

	/**
	 * Gestion du système de nouvelle partie.
	 */
	newGame() {
    alert('newGame');
	}

	/**
	 * Attache un écouteur d'événement sur le bouton "Nouvelle partie"
	 * positionné dans le header de l'application, pour démarrer une nouvelle
	 * partie au clic sur ce bouton.
	 */
	attachEvent() {
		// On récupère le bouton...
		const newGameHeaderButton = document.getElementById('new-game');
		// ... et on lui attache un écouteur d'événement sur les clics,
		// pour appeler la méthode `this.newGame`.
		newGameHeaderButton.addEventListener('click', () => this.newGame());
	}

	/**
	 * Initialise les pré-requis pour le memory.
	 */
	init() {
		// On prépare le bouton du header pour qu'il réagisse au clic
		// et qu'il permette de démarrer une nouvelle partie.
		this.attachEvent();
	}
}

module.exports = Memory;
