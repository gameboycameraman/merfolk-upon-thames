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
      if (response.statusCode == 404) {
        console.log("Sorry love, we can't seem to find the card, maybe there is a typo?");
        return readline.question(`\nWhich card(s) are you looking for?\n`, (arguments) => {
          querySearch(arguments);
        });
      }
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
  readline.question(`\nWhat do you want to do?\n1 - Search for a card?\n2 - Remove a card from the current deck \n3 - Create a new deck\n4 - See your deck status?\n5 - Change deck\n6 - Close the app?\n`, (arg) => {
    if (arg == "1" || arg.toLowerCase() == "search") {
      queryQuestion();
    } else if (arg == "2" || arg.toLowerCase() == "remove") {
      questionRemoveCard();
    } else if (arg == "3" || arg.toLowerCase() == "new") {
      createNewDeck()
    } else if (arg == "4" || arg.toLowerCase() == "status") {
      console.log("You currently have these cards in your deck:");
      currentDeck.collection.forEach(currentDeck.showDeck);
      startingQuestion();
    } else if (arg == "5" || arg.toLowerCase() == "change") {
      changeCurrentDeck(deckCollection)
    } else if (arg == "6" || arg.toLowerCase() == "close") {
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

      if (answer.toLowerCase() == "y" || answer.toLowerCase() == "yes") {
        if (currentDeck) {
          questionHowManyCard(card);
        } else {
          console.log("\nOh sorry, you seem to be missing a deck! You need to create one first.");
          createNewDeck(card);
        }
      } else {
        repeatQuestion();
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
      if (number > 4) {
        console.log("You can't add more than 4 cards");
        questionHowManyCard(card);
      } else {
        for (var i = 0; i < number; i++) {
          currentDeck.collection.push(card);
        };
        console.log("\nYou currently have these cards in your deck:");
        currentDeck.collection.forEach(currentDeck.showDeck);
        startingQuestion();
      };
      resolve();
    });
  });
};

const findName = () => {
  return new Promise((resolve, reject) => {
    readline.question(`\nWhat do you want to delete?\n`, (name) => {
      resolve(name);
    });
  });
};

const findNumber = () => {
  return new Promise((resolve, reject) => {
    readline.question(`\nHow many?\n`, (number) => {
      resolve(number);
    });
  });
};

// This prompt the user to name the card they want to delete
// It also asks how many copies of the card they want to delete
// Then we find the index position of the card in the array
// And splice will start by checking where to delete and how many to delete from there
// We could improve the splice method by using numberOfCard instead of hard coding 1
// It would also remove the for loop
// But we need to make sure they are enough copies of the card in the array before doing so, if not it might delete other cards
const questionRemoveCard = async () => {
  var cardName = await findName();
  var numberOfCard = await findNumber();
  if (numberOfCard > 4) {
    console.log("You can't remove more than 4 cards");
    questionRemoveCard();
  } else {
    for (var i = 0; i < numberOfCard; i++) {
      let cardToFind = (card) => card.name === cardName;
      let cardToDelete = currentDeck.collection.findIndex(cardToFind);
      currentDeck.collection.splice(cardToDelete, 1);
    };
    console.log("\nYou currently have these cards in your deck:");
    currentDeck.collection.forEach(currentDeck.showDeck);
    startingQuestion();
  };
};

// This prompt the user if she/he wants to repeat the process
var repeatQuestion = () => {
  readline.question(`\nWould you like to perform a new search? (y/n)\n`, (answer) => {
    if (answer == "yes" || answer == "y") {
      queryQuestion();
    } else {
      startingQuestion();
    };
  });
};

startingQuestion();
