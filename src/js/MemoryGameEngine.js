const { default: axios } = require('axios');
const MemoryCard = require('./MemoryCard');
const MemoryClock = require('./MemoryClock');
const MemoryHUD = require('./MemoryHUD');

// MemoryGameEngine est la class gérant tout ce qui est relatif
// à la partie en cours.
class MemoryGameEngine {
  constructor(fruits, newGameCallback) {
    this.fruitsPerGame = 1;
		this.msBetweenFlip = 1000;
		this.maxSecondsPerGame = 120;
		this.fruits = fruits.shuffle().slice(0, this.fruitsPerGame);
    this.cards = [];
		this.HUD = new MemoryHUD();
    this.flippedCards = 0;
    this.canFlip = true;
    this.finishedAt = null;
    this.clock = new MemoryClock();
		// Puisque nous sommes dans une instance de `MemoryGameEngine`,
		// nous ne pouvons pas faire `this.newGame()` pour démarrer
		// une nouvelle partie car cette méthode est propre à la class `Memory`.
		// Cependant on peut stocker cette méthode dans notre instance
		// pour pouvoir l'utiliser quand on le souhaite !
		this.newGameCallback = newGameCallback;
  }

	/**
	 * Réinitialise l'interface du jeu.
	 */
	clearHUD() {
		this.HUD.setElapsedTime(0, this.maxSecondsPerGame);
		this.HUD.setFlippedCards(0);
	}

	/**
	 * Actualise l'interface du jeu.
	 */
  refreshHUD() {
		this.HUD.setFlippedCards(this.flippedCards);
		this.HUD.setElapsedTime(this.clock.elapsedTime, this.maxSecondsPerGame);
  }

	/**
	 * Soumet les informations de la partie et du formulaire
	 * à notre serveur pour stocker les informations.
	 * @param username
	 */
	submitScore(username) {
		axios.post('/scoreSubmit', {
			username,
			elapsedTime: this.clock.elapsedTime,
			finishedAt: this.finishedAt,
		})
			.then(({ data }) => {
				// Si l'enregistrement des données a fonctionné,
				// on peut alors masquer supprimer le formulaire
				// de la fenêtre modale.
				this.HUD.updateLeaderboard(data.scores);
				this.HUD.hideResultsForm();
			});
	}

	/**
	 * Supprime la fenêtre modale et supprime les cartes de la grille de jeu
	 * pour laisser apparaître le tableau des scores.
	 */
	displayLeaderboardHandler() {
		// On fait disparaître doucement la fenêtre modale
		this.HUD.vanishResults();

		// Dans 500ms...
		setTimeout(() => {
			// ... on rend transparentes toutes les cartes...
			this.HUD.vanishBoard();

			// ... puis dans 300ms...
			setTimeout(() => {
				// ... on enlève le flou sur la grille de jeu...
				this.HUD.removeBlurBoard();
				// ... on supprime les cartes de la grille de jeu...
				this.HUD.removeCards();
				// ... on applique une classe CSS sur le tableau des scores
				// pour qu'il ait une opacity à 0...
				this.HUD.vanishLeaderboard();
				// ... on enlève le `display: none;` sur le tableau des scores...
				this.HUD.displayLeaderboard();

				// ... et enfin (promis c'est le dernier) après 300ms...
				setTimeout(() => {
					// ... on rétabli l'opacité du tableau des scores...
					this.HUD.appearLeaderboard();
					// ... on supprime du DOM la fenêtre modale...
					this.HUD.hideResults();
					// ... et pour terminer, on remet l'opacité de la grille de jeu à son état initial
					this.HUD.appearBoard();
				}, 300);
			}, 300);
		}, 500);
	}

	/**
	 * Gestion des méthodes pour l'animation de disparition de la
	 * fenêtre modale de fin de partie et initialise une nouvelle partie.
	 */
	newGameHandler() {
		// On fait disparaître doucement la fenêtre modale
		this.HUD.vanishResults();

		// Dans 750ms...
		setTimeout(() => {
			// ... on force l'état "caché" sur toutes les cartes de l'ancienne partie.
			this.HUD.closeAllCards();

			// ... puis dans 250ms...
			setTimeout(() => {
				// ... on enlève le flou sur la grille de jeu...
				this.HUD.removeBlurBoard();

				// ... et enfin (promis c'est le dernier !) après 300ms...
				setTimeout(() => {
					// ... on supprime du DOM la fenêtre modale...
					this.HUD.hideResults();
					// ... et on démarre une nouvelle partie.
					this.newGameCallback();
				}, 300);
			}, 250);
		}, 750);

		// Ces trois `setTimeout` imbriqués peuvent heureusement être décomposés,
		// c'est-à-dire ne pas être imbriqués à condition d'additionner les temps
		// d'attente de chaque `setTimeout` !
		//
		// Exemple :
		// 1. `setTimeout` imbriqués (250ms, puis 250ms)
		// 	setTimeout(() => {
		// 		/* ... */
		// 		setTimeout(() => {/* ... */}, 250);
		// 	}, 250);
		//
		// 2. `setTimeout` indépendants (250ms, puis 250ms + 250ms (500ms))
		// 	setTimeout(() => {/* ... */}, 250);
		// 	setTimeout(() => {/* ... */}, 500);
	}

	/**
	 * Gestion de la fin de partie.
	 */
	gameFinished() {
		// On stocke la date et heure de la fin de la partie.
		this.finishedAt = new Date();
		// On floute l'arrière plan.
		this.HUD.blurBoard();
    // On stoppe l'horloge interne du jeu.
    this.clock.end();
		// On bloque la possibilité de retourner de nouvelles cartes.
		this.canFlip = false;
		// On affiche l'écran de fin de jeu.
		this.HUD.displayResults(
			this.flippedCards,
			this.fruits.filter((fruit) => fruit.found).length,
			this.fruitsPerGame,
			this.clock.elapsedTime,
			() => this.newGameHandler(),
			(username) => this.submitScore(username),
			() => this.displayLeaderboardHandler()
		);
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
	 * Vérifie si l'utilisateur est à court de temps pour déclencher la fin
	 * de la partie, ou bien laisser l'utilisateur continuer de jouer
	 * s'il lui reste du temps.
	 */
	checkElapsedTime() {
		if (this.clock.elapsedTime >= this.maxSecondsPerGame) this.gameFinished();
	}

	/**
	 * Incrémente le temps écoulé de 1 à chaque appel
	 * puis rafraichi l'interface du jeu.
	 */
	incrementElapsedTime() {
		// On rajoute une seconde au timer...
		this.clock.elapsedTime += 1;
		// ... puis on actualise l'interface du jeu.
		this.refreshHUD();

		// Puisqu'il y a une limite de temps sur la partie,
		// on vérifie si le joueur ne l'a pas dépassée.
		this.checkElapsedTime();
	}
  
  /**
	 * Gestion du retournement des cartes vers face visible.
	 * @param {MemoryCard}
	 */
	flipCard(currentCard) {
    // Si le joueur ne peut pas retourner de cartes pour le moment,
    // on sort de la méthode `flipCard`.
    if (!this.canFlip) return;

    // Si l'horloge de jeu n'a pas encore démarré,
    // on la démarre de ce pas !
    // Elle n'est pas active avant de cliquer pour
    // la première fois sur une carte.
    if (null === this.clock.id) this.clock.start(() => this.incrementElapsedTime());

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
	 * Supprime les cartes du DOM et du système de l'application.
	 */
	removeCards() {
		// On supprime les cartes de la grille de jeu...
		this.HUD.removeCards();
		// ... puis on vide notre propriété `this.cards`.
		this.cards = [];
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
