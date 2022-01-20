const MemoryFruit = require('./MemoryFruit');
const MemoryGameEngine = require('./MemoryGameEngine');

const fruitsData = require('../data/fruits');

class Memory {
	constructor() {
		this.fruits = [];
    this.gameEngine = null;
	}

	/**
	 * Gestion du système de nouvelle partie.
	 */
	newGame() {
		// On vient faire une nouvelle instanciation de notre class MemoryGameData...
		this.gameEngine = new MemoryGameEngine(this.fruits);
    // ... puis on crée de nouvelles cartes.
    this.gameEngine.createCards();
	}

	/**
	 * Récupère les différents fruits disponibles pour les stocker
	 * dans l'instance actuelle de `Memory`, selon la class `MemoryFruit`.
	 */
	retrieveFruits() {
		// On stocke tous les fruits disponibles dans le jeu et pour
		// chaque fruit, on instancie à chaque fois la classe `MemoryFruit`.
		fruitsData.forEach((fruit) => {
      this.fruits.push(new MemoryFruit(fruit.name, fruit.translateY));
    });
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

		// On vient préparer notre liste de fruits.
		this.retrieveFruits();
	}
}

module.exports = Memory;
