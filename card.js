var request = require('request');
card = request('https://api.scryfall.com/cards//search?q=name:once-upon-a-time', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', JSON.parse(body).data[0].name); // Print the HTML for the Google homepage.
// return body;
});

// console.log(card);

// Object.keys(card).forEach(function (key) {
//   if (card[key] == "Once upon a time") {
//     console.log("Yay bitch!");
//   } else {
//     console.log("Didn't find anything mate..........");
//   }
// //   console.log(item); // key
// //   console.log(card[item]); // value
// });
