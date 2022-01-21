require('./arrayShuffle'); // notre méthode ajoutée sur tous les arrays
const Memory = require('./Memory');

// Dès que le contenu du DOM est chargé, on exécute la méthode "init".
document.addEventListener('DOMContentLoaded', () => {
  const memory = new Memory();
  memory.init();
});
