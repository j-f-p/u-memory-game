/*
 * When viewport window is smaller than game content, upon page load,
 * scroll view so that game is horizontally centered.
 */
// document.addEventListener('DOMContentLoaded', function () {
const windowWidth = window.innerWidth - 17;
/* 17 px is browswer scroll bar width on Chrome and FireFox.
   TODO: This correction should be automatically determined. Touch screen
   mode without scroll bars should not have a correction. */
const deckWidth =
  document.getElementsByClassName('deck')[0].getBoundingClientRect().width;
if( windowWidth < deckWidth ) {
  window.scroll( (deckWidth - windowWidth)/2, 0);
}
// });

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Generate a list of shuffled cards
 */

// String array of card symbols
let symbols = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor",
  "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

symbols = symbols.concat(symbols); // adds a copy of each symbol
const nCards = symbols.length;

// String array of card symbols shuffled
symbols = shuffle(symbols);

// Apply shuffled order of symbols to card elements
const cardElements = document.getElementsByClassName('card');

for( let i=0; i<nCards; i++ ) {
  cardElements[i].firstElementChild.className = symbols[i];
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// a variable to monitor the number of open cards and their identity
let openCardIndices = [];

function closeOpenCards() { // pre-condition: openCardIndices.length===2
  cardElements[openCardIndices.pop()].classList.remove("open", "show");
  cardElements[openCardIndices.pop()].classList.remove("open", "show");
} // a for loop here would require more code

for( let i=0; i<nCards; i++ ) {
  cardElements[i].addEventListener('click', function() {
    if(cardElements[i].classList.length===1) {
      if(openCardIndices.length===2) {
        closeOpenCards();
      }
      cardElements[i].classList.add("open", "show");
      openCardIndices.push(i);
    } else if (cardElements[i].classList.contains("open")) {
      cardElements[i].classList.remove("open", "show");
      openCardIndices.pop();
    }
    // console.log(openCardIndices.length); REMOVE LINE
  });
}
