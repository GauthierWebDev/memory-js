class MemoryCard {
	constructor(fruit) {
		this.DOMElement = null;
		this.found = false;
		this.flipped = false;
		this.fruit = fruit;
	}

	prepareCardDOM(template, board) {
    // On commence par cloner le template déjà esistant...
		this.DOMElement = document.importNode(template.content, true).querySelector('li');
    
    // ... on lui ajoute une variable CSS pour afficher
    // le bon fruit parmi toute l'image...
		this.DOMElement.style.setProperty('--translateY', `${this.fruit.translateY}px`);
    
    // ... et enfin, on l'ajoute dans le DOM !
		board.append(this.DOMElement);
	}
}

module.exports = MemoryCard;
