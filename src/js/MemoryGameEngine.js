const MemoryCard = require('./MemoryCard');
const MemoryHUD = require('./MemoryHUD');

// MemoryGameEngine est la class gérant tout ce qui est relatif
// à la partie en cours.
class MemoryGameEngine {
  constructor(fruits) {
    this.fruitsPerGame = 14;
		this.msBetweenFlip = 1000;
		this.maxSecondsPerGame = 120;
		this.fruits = fruits.shuffle().slice(0, this.fruitsPerGame);
    this.cards = [];
		this.HUD = new MemoryHUD();
    this.flippedCards = 0;
    this.canFlip = true;
  }

	/**
	 * Actualise l'interface du jeu.
	 */
  refreshHUD() {
		this.HUD.setFlippedCards(this.flippedCards);
  }
  
  /**
	 * Gestion des cartes actuellement retournées (hors cartes trouvées).
   * @param {[]}
   */
	checkVisibleCards(cards) {
		// On modifie la valeur de la propriété "canFlip" à false pour
		// pouvoir interdire le retournement d'autres cartes.
		this.canFlip = false;
  }
  
  /**
	 * Gestion du retournement des cartes vers face visible.
	 * @param {MemoryCard}
	 */
	flipCard(currentCard) {
    // Si le joueur ne peut pas retourner de cartes pour le moment,
    // on sort de la méthode `flipCard`.
    if (!this.canFlip) return;

		// On indique la carte cliquée comme retournée avec une classe CSS (face visible)...
		currentCard.DOMElement.classList.add('Card--visible');
		// ... on donne à notre objet le status retourné...
		currentCard.flipped = true;
    // ... on incrémente le nombre total de cartes retournées...
    this.flippedCards += 1;
    // ... puis on rafraichi l'HUD !
    this.refreshHUD();

		// On récupère toutes les cartes faces visibles (hors cartes trouvées).
		// Puisqu'on bloque le nombre de cartes retournées à deux lors de la
		// vérification des cartes (this.checkVisibleCards()),
		// `visibleCards` aura soit une carte, soit deux cartes, mais jamais plus !
    const visibleCards = this.cards.filter((card) => card.flipped);

    // Si exactement deux cartes sont actuellement retournées...
		if (2 === visibleCards.length) {
			// ... alors on vérifie qu'elles sont identiques...
			this.checkVisibleCards(visibleCards);
			// ... puis on retire le status "retourné" sur ces deux cartes.
			visibleCards.forEach((card) => card.flipped = false);
		}
	}

	/**
	 * Gestion de la création des cartes pour la nouvelle grille de jeu.
	 */
	createCards() {
		// Ici, on crée un tableau avec deux fois les valeurs contenues
		// dans la propriété `this.fruits`.
		// Cela nous permet d'avoir deux fois chaque fruit !
		// Par contre, ils ne sont pas mélangés entre eux, on va donc
		// utiliser notre prototype sur les arrays pour mélanger
		// ce joli tableau pour éviter que les cartes soient toujours
		// aux mêmes positions sur la grille de jeu.
		[...this.fruits, ...this.fruits].shuffle().forEach(fruit => {
      // Ici, on gère l'instanciation d'une nouvelle carte pour
      // le fruit qui lui a été donné et on ajoute un eventListener...
			const newCard = new MemoryCard(fruit, (card) => this.flipCard(card));

      // ... puis on le configure pour qu'il corresponde au fruit choisi
      // tout en prenant soin de l'insérer dans la grille de DOM...
			newCard.prepareCardDOM(this.HUD.cardTemplate, this.HUD.boardContainer);

      // ... et ici, on stocke notre objet dans la liste
      // des cartes de la partie en cours.
			this.cards.push(newCard);
		});
	}
}

module.exports = MemoryGameEngine;
