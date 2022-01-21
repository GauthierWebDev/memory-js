class MemoryClock {
  constructor() {
    this.id = null;
    this.elapsedTime = 0;
  }

  /**
   * Supprime l'intervalle de l'horloge interne du jeu.
   */
  end() {
    clearInterval(this.id);
  }

  /**
   * Démarre une nouvelle horloge interne pour le jeu,
   * appelant le callback fourni durant
   * l'appel de cette méthode.
   * @param callback
   */
  start(callback) {
    this.id = setInterval(() => callback(), 1000);
  }
}

module.exports = MemoryClock;
