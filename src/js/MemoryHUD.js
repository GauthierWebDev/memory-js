class MemoryHUD {
  constructor() {
    // Templates
    this.cardTemplate = document.getElementById('Card');

    // Grille de jeu
    this.boardContainer = document.getElementById('Board');
  }
}

exports.default = MemoryHUD;
