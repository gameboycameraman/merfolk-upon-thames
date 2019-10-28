class Deck {
  constructor() {
    this.collection = [];
  };

  showDeck(card) {
    console.log(card.name);
  };
}

module.exports = Deck;
