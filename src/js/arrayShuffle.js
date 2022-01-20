// Basé sur l'algorithme de Fisher-Yates (mélange de Knuth)
// => https://fr.wikipedia.org/wiki/M%C3%A9lange_de_Fisher-Yates

/**
 * Crée un nouveau tableau mélangé, à partir du tableau sur lequel cette
 * méthode est utilisée.
 * @returns {[]}
 */
 Array.prototype.shuffle = function() {
	// On crée un nouveau tableau à partir du tableau déjà existant
	let array = Array.from(this);

	// On défini l'index actuel sur la taille du nouveau tableau
	let currentIndex = array.length;

	// On crée un index qui recevra un index au hasard à chaque passage dans la boucle
	let randomIndex;

	// Tant qu'il reste des éléments à mélanger... (= position de l'index différent de 0)
	while (currentIndex !== 0) {
		// ... on prend au hasard un élément restant...
		randomIndex = Math.floor(Math.random() * currentIndex);

		// ... on décrémente la position de notre index...
		currentIndex--;

		// ... puis on fait une inversion sur le contenu de l'index pris au hasard avec celui de notre index qui décrémente
		// à chaque passage dans la boucle
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	// Une fois que le mélange est terminé, on retourne le tableau.
	return array;
}