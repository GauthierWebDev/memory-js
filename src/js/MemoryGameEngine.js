const MemoryCard = require('./MemoryCard');
const MemoryClock = require('./MemoryClock');
const MemoryHUD = require('./MemoryHUD');

// MemoryGameEngine est la class gérant tout ce qui est relatif
// à la partie en cours.
class MemoryGameEngine {
  constructor(fruits) {
    this.fruitsPerGame = 2;
		this.msBetweenFlip = 1000;
		this.maxSecondsPerGame = 120;
		this.fruits = fruits.shuffle().slice(0, this.fruitsPerGame);
    this.cards = [];
		this.HUD = new MemoryHUD();
    this.flippedCards = 0;
    this.canFlip = true;
    this.finishedAt = null;
    this.clock = new MemoryClock();
  }

	/**
	 * Actualise l'interface du jeu.
	 */
  refreshHUD() {
		this.HUD.setFlippedCards(this.flippedCards);
  }

	/**
	 * Gestion de la fin de partie.
	 */
	gameFinished() {
		// On stocke la date et heure de la fin de la partie.
		this.finishedAt = new Date();
		// On floute l'arrière plan
		this.HUD.blurBoard();
	}

	/**
	 * Actionne la fin de partie si toutes les paires ont été trouvées.
	 */
	checkFoundPairs() {
		// Si le nombre de paires trouvées (fruits trouvés)
		// est égal au nombre de fruits dans le jeu,
		// on enclenche la fin de la partie.
		if (this.fruits.filter((fruit) => fruit.found).length === this.fruitsPerGame) {
			this.gameFinished();
		}
	}
  
  /**
	 * Gestion des cartes actuellement retournées (hors cartes trouvées).
   * @param {[]}
   */
	checkVisibleCards(cards) {
		// On modifie la valeur de la propriété "canFlip" à false pour
		// pouvoir interdire le retournement d'autres cartes.
		this.canFlip = false;

    // Si les deux cartes ont le même fruit (apple, bananas etc)...
		if (cards[0].fruit.name === cards[1].fruit.name) {
			// ... alors on défini ces cartes comme "trouvées" et on enlève
			// l'état de carte retournée.

			// Pour chacune de ces deux cartes...
			cards.forEach(card => {
				// ... on ajoute la classe CSS `Card--found`...
				card.DOMElement.classList.add('Card--found');
				// ... on indique la carte comme déjà trouvée...
				card.found = true;
				// ... et on en fait de même pour le fruit.
				card.fruit.found = true;
			});

			// ... puis dans 300ms, on retire la classe CSS `Card--visible` puisque cette
			// carte fait partie du paire trouvée.
			//
			// "300ms ? Mais pourquoi ?"
			// Nous avons une animation, lorsqu'une carte voit son état de carte retournée altéré, qui dure 300ms.
			// Si nous faisons les deux changements de classes CSS en même temps,
			// l'animation ne pourra pas se faire correctement.
			// Il n'est question que de visuel, rien d'obligatoire, mais n'oublions pas que
			// l'UI reste importante pour les utilisateurs, du moment que l'UX est bonne !
			setTimeout(() => {
				cards.forEach((card) => card.DOMElement.classList.remove('Card--visible'));
			}, 300);

			// Et on autorise le fait de pouvoir retourner des cartes à nouveau.
			// Petit rappel : la ligne ci-dessous prend effet avant que la classe CSS soit supprimée dans
			// le `setTimeout`, pas besoin d'attendre 300ms pour retourner de nouvelles cartes !
			this.canFlip = true;

			// On vérifie si toutes les paires ont été trouvées pour éventuellement
			// déclencher la fin de la partie.
			this.checkFoundPairs();
		}
		else {
			// ... sinon, on retourne simplement les deux cartes
			// après un court délai défini sur `this.msBetweenFlip`.
			setTimeout(() => {
				cards.forEach((card) => {
					card.DOMElement.classList.remove('Card--visible');
					// On va également autoriser de nouveau le retournement de cette
					// même carte, puisque sa jumelle n'a pas été trouvée.
					card.canFlip = true;
				});

				// On profite d'avoir retourné ces cartes pour également autoriser
				// de nouveau le retournement des cartes, sans quoi le jeu se retrouverait bloqué.
				this.canFlip = true;
			}, this.msBetweenFlip);
		}
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
