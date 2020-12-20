

class Deck {
  constructor(name) {
    this.name = name;
    this.collection = [];
  };

  showDeck(card) {
    console.log(card.name);
  };

  addCards(card, amount) {
    if (amount > 4) {
      throw "You can't add more than 4 cards";
    } else {
      for (var i = 0; i < amount; i++) {
        this.collection.push(card);
      }
    }
  }

  removeCards(cardName, amount) {
    for (var i = 0; i < amount; i++) {
      let cardToFind = (card) => card.name === cardName;
      let cardToDelete = this.collection.findIndex(cardToFind);
      this.collection.splice(cardToDelete, 1);
    };
  }
}

module.exports = Deck;
