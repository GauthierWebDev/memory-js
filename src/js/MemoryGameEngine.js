// MemoryGameEngine est la class gérant tout ce qui est relatif
// à la partie en cours.
class MemoryGameEngine {
  constructor(fruits) {
    this.fruitsPerGame = 14;
		this.msBetweenFlip = 1000;
		this.maxSecondsPerGame = 120;
		this.fruits = fruits;
  }
}

module.exports = MemoryGameEngine;
