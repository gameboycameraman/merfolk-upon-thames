var request = require('request');
const Deck = require('./deck.js');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var deck = new Deck();

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
      readline.question(`\nWould you like to add it to your deck? (y/n)\n`, (arg) => {
        if (arg.toLowerCase() == "y" || arg.toLowerCase() == "yes") {
          deck.collection.push(card);
          console.log("\nYou currently have these cards in your deck:");
          deck.collection.forEach(deck.showDeck);
          startingQuestion();
        } else {
          repeatQuestion();
        }
      });
    });
  });
};

var startingQuestion = () => {
  readline.question(`\nWhat do you want to do?\n1 - Search for a card?\n2 - See your deck status?\n3 - Close the app?\n`, (arg) => {
    if (arg == "1" || arg.toLowerCase() == "search") {
      queryQuestion();
    } else if (arg == "2" || arg.toLowerCase() == "deck") {
      console.log("You currently have these cards in your deck:");
      deck.collection.forEach(deck.showDeck);
      startingQuestion();
    } else if (arg == "3" || arg.toLowerCase() == "close") {
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
