const MemoryCard = require('./MemoryCard');
const MemoryHUD = require('./MemoryHUD');

// MemoryGameEngine est la class gérant tout ce qui est relatif
// à la partie en cours.
class MemoryGameEngine {
  constructor(fruits) {
    this.fruitsPerGame = 14;
		this.msBetweenFlip = 1000;
		this.maxSecondsPerGame = 120;
		this.fruits = fruits;
    this.cards = [];
		this.HUD = new MemoryHUD();
  }

	/**
	 * Gestion de la création des cartes pour la nouvelle grille de jeu.
	 */
	createCards() {
    // Pour chaque fruit, nous créons une carte
		this.fruits.forEach(fruit => {
      // Ici, on gère l'instanciation d'une nouvelle carte pour
      // le fruit qui lui a été donné...
			const newCard = new MemoryCard(fruit);

      // ... et ici, on stocke notre objet dans la liste
      // des cartes de la partie en cours.
      // Par contre, la carte n'apparaît pas dans le DOM !
			this.cards.push(newCard);
		});
	}
}

module.exports = MemoryGameEngine;
