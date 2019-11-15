class Deck {
  constructor(name) {
    this.deckName = name;
    this.collection = [];
  };

  showDeck(card) {
    console.log(card.name);
  };
}

module.exports = Deck;
