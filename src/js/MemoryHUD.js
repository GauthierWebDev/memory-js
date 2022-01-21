class MemoryHUD {
  constructor() {
    // Templates
    this.cardTemplate = document.getElementById('Card');
    this.scoreTemplate = document.getElementById('Score');
    this.gameResultsTemplate = document.getElementById('GameResults');

    // Résultats de fin de partie
    this.gameResultsContainer = null;

    // Grille de jeu
    this.boardContainer = document.getElementById('Board');

    // Tableau des scores    
    this.leaderboardContainer = document.getElementById('Leaderboard');
    this.scoresContainer = document.getElementById('Scores');

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
   * @param elapsedTime
   * @param maxSecondsPerGame
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
   * Converti une valeur de colonne `time` des bases de données
   * en secondes.
   * @param time
   * @returns {number}
   */
  convertTimeToSeconds(time) {
    let seconds = 0;
    const splitTime = time.split(':');

    // On converti les heures en secondes et on les ajoute aux secondes totales...
    seconds += parseInt(splitTime[0], 10) * 3600; // 1 = 60 minutes = 3600 secondes
    seconds += parseInt(splitTime[1], 10) * 60;
    seconds += parseInt(splitTime[2], 10);

    return seconds;
  }

  /**
   * Converti une valeur de colonne `time` des bases de données
   * en secondes puis est formatée dans le format m:SS.
   *
   * m = minutes sans préfixe (1 restera 1)
   *
   * SS = secondes avec préfixe (1 deviendra 01)
   * @param time
   * @returns {string}
   */
  formatElapsedTimeFromDBTime(time) {
    return this.formatElapsedTime(this.convertTimeToSeconds(time));
  }

  /**
   * Formate une date au format DD/MM/YYYY.
   *
   * DD = jour (1 deviendra 01)
   *
   * MM = mois (1 deviendra 01)
   *
   * YYYY = année (`2021`, `2022` et pas `21`, `22`)
   * @param date
   * @returns {string}
   */
  formatDate(date) {
    date = new Date(date);
    const day = date.getDate();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  /**
   * Actualise les données relatives au temps écoulé sur le HUD.
   *
   * @param elapsedTime
   * @param maxSecondsPerGame
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
   * Anime les cartes de la précédente partie au travers des classes CSS
   * dédiées aux états des cartes.
   */
  closeAllCards() {
    // On récupère toutes les cartes sur la grille de jeu...
    this.boardContainer.querySelectorAll('.Card').forEach((card) => {
      // ... et à chacune, on rajoute la classe CSS `Card--visible`.
      card.classList.add('Card--visible');

      // 300ms après le rajout de la classe CSS `Card--visible`...
      setTimeout(() => {
        // ... on supprime les classes CSS `Card--found` et `Card--visible`...
        card.classList.remove('Card--found', 'Card--visible');
        // ... puis on rajoute la classe CSS `Card--hidden`.
        card.classList.add('Card--hidden');
      }, 300);
    });
  }

  hideResults() {
    this.gameResultsContainer.outerHTML = '';
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
   * Supprime tous les scores enregistrés dans le DOM.
   */
  emptyLeaderboard() {
    this.scoresContainer
      .querySelectorAll('.Score:not(.ScoreHeader)')
      .forEach((score) => score.outerHTML = '');
  }

  /**
   * Mets à jour le tableau des scores avec les données communiquées
   * en entrée.
   * @param scores
   */
  updateLeaderboard(scores) {
    this.emptyLeaderboard();
    scores.forEach((score, index) => {
      const scoreLi = document.importNode(this.scoreTemplate.content, true).querySelector('li');
      scoreLi.querySelector('.Score-Rank').innerHTML = index + 1;
      scoreLi.querySelector('.Score-Username').innerHTML = score.username;
      scoreLi.querySelector('.Score-Duration').innerHTML = this.formatElapsedTimeFromDBTime(score.elapsedTime);
      scoreLi.querySelector('.Score-Date').innerHTML = this.formatDate(score.finishedAt);

      this.scoresContainer.append(scoreLi);
    });

    // Si nous avons des scores...
    if (scores.length > 0) {
      // ... alors on affiche la liste des scores...
      this.leaderboardContainer.querySelector('.ifNoScores').classList.add('ifNoScores--hidden');
      // ... puis on masque le paragraphe qui ne doit s'afficher que s'il
      // n'y a aucun score visible.
      this.scoresContainer.classList.remove('Scores--hidden');
    }
    else {
      // Sinon, on fait tout l'inverse ici puisqu'il n'y a pas de scores.
      this.leaderboardContainer.querySelector('.ifNoScores').classList.remove('ifNoScores--hidden');
      this.scoresContainer.classList.add('Scores--hidden');
    }
  }

  /**
   * Fait apparaître le tableau des scores.
   */
  displayLeaderboard() {
    this.leaderboardContainer.classList.remove('Leaderboard--hidden');
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
   * Supprime la classe CSS responsable d'une opacité à 0 sur
   * le tableau des scores.
   */
  appearLeaderboard() {
    this.leaderboardContainer.classList.remove('Leaderboard--vanish');
  }

  /**
   * Supprime le contenu de la grille de jeu.
   */
  removeCards() {
    this.boardContainer.innerHTML = '';
  }

  /**
   * Floute la grille de jeu.
   */
  blurBoard() {
    this.boardContainer.classList.add('Board--blurred');
  }

  /**
   * Supprime le flou sur la grille de jeu.
   */
  removeBlurBoard() {
    this.boardContainer.classList.remove('Board--blurred');
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
