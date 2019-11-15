var request = require('request');
const Deck = require('./deck.js');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var deckCollection = [];
var currentDeck;

var querySearch = (arguments) => {

  var splitArguments = arguments.split(",");
  let card;

  splitArguments.forEach( function(argument) {
    var formatedArgument = argument.replace(/ /g,"-");

    apiCall = request('https://api.scryfall.com/cards//search?q=name:' + formatedArgument, function (error, response, body) {
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      card = JSON.parse(body).data[0]; // Print the HTML for the Google homepage.
      // return body;
      console.log("Card name:", card.name);
      console.log("Card text:", card.oracle_text);

      questionAddCard(card);

    });
  });
};

// The original question that ask the user what she/he wants to do
var startingQuestion = () => {
  readline.question(`\nWhat do you want to do?\n1 - Search for a card?\n2 - Create a new deck\n3 - See your deck status?\n4 - Change deck\n5 - Close the app?\n`, (arg) => {
    if (arg == "1" || arg.toLowerCase() == "search") {
      queryQuestion();
    } else if (arg == "2" || arg.toLowerCase() == "new") {
      createNewDeck()
    } else if (arg == "3" || arg.toLowerCase() == "status") {
      console.log("You currently have these cards in your deck:");
      currentDeck.collection.forEach(currentDeck.showDeck);
      startingQuestion();
    } else if (arg == "4" || arg.toLowerCase() == "change") {
      changeCurrentDeck(deckCollection)
    } else if (arg == "5" || arg.toLowerCase() == "close") {
      console.log('Bye 👋');
      readline.close();
    } else {
      console.log("\nI'm sorry, I didn't understand");
      startingQuestion();
    }
  });
};


// This create the first question when running the script
var queryQuestion = () => {
  readline.question(`\nWhich card(s) are you looking for?\n`, (arguments) => {
    querySearch(arguments);
  });
};

// Create a new instance of Deck, gives it a name and put it in the currentDeck variable
// If there is already something in currentDeck, it saves the content it deckCollection
var createNewDeck = (card) => {
  return new Promise((resolve, reject) => {
    readline.question(`\nWhat will be the name of your deck?\n`, (answer) => {
      var formatedName = answer.replace(/ /g,"-");
      console.log("THIS IS currentDeck", Boolean(currentDeck));
      if (currentDeck) {
        deckCollection.push(currentDeck);
      }
      currentDeck = new Deck(formatedName);
      if (card) {
        questionAddCard(card);
      } else {
        startingQuestion();
      };
      resolve();
    });
  });
};

// List all the decks and query the user to say which one she/he wants to change
var changeCurrentDeck = (deckCollection) => {
  return new Promise((resolve, reject) => {
    if (deckCollection.length == 0) {
      console.log("\nYou have created no deck yet");
      startingQuestion();
    } else {
      deckCollection.push(currentDeck)
      console.log("This is deckCollection", deckCollection);
      console.log(`\nThese are the current decks you have:\n`);
      deckCollection.forEach(deck => console.log(deck.deckName));
      readline.question(`Which one do you want to amend?\n`, (name) => {
        var formatedName = name.replace(/ /g,"-");
        currentDeck = deckCollection.find((deck) => deck.deckName === formatedName);
        startingQuestion();
      });
    };
    resolve();
  });
};


// This ask to the user if she/he wants to add a card to the deck
const questionAddCard = (card) => {
  return new Promise((resolve, reject) => {
    readline.question(`\nWould you like to add "` + card.name + `" to your deck? (y/n)\n`, (answer) => {
      if (currentDeck) {
        if (answer.toLowerCase() == "y" || answer.toLowerCase() == "yes") {
          questionHowManyCard(card);
        } else {
          repeatQuestion();
        }
      } else {
        console.log("\nOh sorry, you seem to be missing a deck! You need to create one first.");
        createNewDeck(card);
      };
      resolve();
    });
  });
};


// This ask the user how many card she/he wants to add to the deck
// It also adds the card(s) to the deck
// It also shows the current status of the deck using the `deck.showDeck` function
const questionHowManyCard = (card) => {
  return new Promise((resolve, reject) => {
    readline.question(`\nHow many would you like? \n`, (number) => {
      for (var i = 0; i < number; i++) {
        currentDeck.collection.push(card);
      }
      console.log("\nYou currently have these cards in your deck:");
      currentDeck.collection.forEach(currentDeck.showDeck);
      startingQuestion();
      resolve();
    });
  });
};


// This prompt the user if she/he wants to repeat the process
var repeatQuestion = () => {
  readline.question(`\nWould you like to perform a new search? (y/n)`, (answer) => {
    if (answer == "yes" || answer == "y") {
      queryQuestion();
    } else {
      startingQuestion();
    };
  });
};

startingQuestion();
