class MemoryCard {
  constructor(fruit, flipCard) {
    this.DOMElement = null;
    this.found = false;
    this.flipped = false;
    this.fruit = fruit;
    // Comme depuis un objet `MemoryCard` on ne
    // peut pas directement appeler la méthode
    // `flipCard` de la class `MemoryGameEngine`,
    // on stocke un callback qu'on attachera lorsque
    // nous définirons le DOM de la carte.
    this.flipCard = flipCard;
  }

  /**
   * On prépare le contenu de la carte à insérer dans le DOM.
   * @param template
   * @param board
   */
  prepareCardDOM(template, board) {
    // On commence par cloner le template déjà existant...
    this.DOMElement = document.importNode(template.content, true).querySelector('li');

    // ... on lui ajoute une variable CSS pour afficher
    // le bon fruit parmi toute l'image...
    this.DOMElement.style.setProperty('--translateY', `${this.fruit.translateY}px`);

    // ... on rajoute un eventListener pour pouvoir
    // retourner la carte au clic...
    this.DOMElement.addEventListener('click', () => this.flipCard(this));

    // ... et enfin, on l'ajoute dans le DOM !
    board.append(this.DOMElement);
  }
}

module.exports = MemoryCard;
