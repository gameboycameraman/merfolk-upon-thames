const Deck = require('../src/deck.js');

describe("Deck", () => {
  it("Can create a deck with a name", () => {
    currentDeck = new Deck("Goblin");

    expect(currentDeck.name).toEqual("Goblin");
  });

  it("Can create an empty deck", () => {
    currentDeck = new Deck();

    expect(currentDeck.collection).toEqual([]);
  });

  describe("Can add", () => {
    beforeEach(() => {
      currentDeck = new Deck("Goblin");
    });

    it("a card to the current deck", () => {
      currentDeck.addCards("Krenko, Mob Boss", 1);
      expect(currentDeck.collection[0]).toEqual("Krenko, Mob Boss");
    });

    it("multiple cards to the current deck", () => {
      currentDeck.addCards("Krenko, Mob Boss", 4);
      expect(currentDeck.collection.length).toEqual(4);
    });
  });

  describe("Can't add", () => {
    beforeEach(() => {
      currentDeck = new Deck("Goblin");
    });

    it("More than 4 of the same cards", () => {
      expect(() => {currentDeck.addCards("Krenko, Mob Boss", 5)}).toThrowError("You can't add more than 4 cards");
    });
  });

  describe("Can remove", () => {
    beforeEach(() => {
      currentDeck = new Deck("Goblin");
      currentDeck.addCards("Krenko, Mob Boss", 4);
    });

    it("a card from the current deck", () => {
      currentDeck.removeCards("Krenko, Mob Boss", 1);
      expect(currentDeck.collection.length).toEqual(3);
    });

    it("multiple cards from the current deck", () => {
      currentDeck.removeCards("Krenko, Mob Boss", 3);
      expect(currentDeck.collection.length).toEqual(1);
    });
  });
});