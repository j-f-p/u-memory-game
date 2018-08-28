/* Viewport view ***********************************************************80*/
// When viewport window is smaller than game content, upon page load,
// scroll view so that game is horizontally centered.

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

/* HTML Elements ***********************************************************80*/

/* List of shuffled cards - - - - - - - - - - - - - - - - - - - - - - - - - - */

// String array of card symbols
let symbols = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor",
  "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
const nSymbols = symbols.length;

symbols = symbols.concat(symbols); // adds a copy of each symbol to form matches
const nCards = symbols.length;

// String array of card symbols shuffled
symbols = shuffle(symbols);

// Apply shuffled order of symbols to card elements
const cardElements = document.getElementsByClassName('card');

for( let i=0; i<nCards; i++ ) {
  cardElements[i].firstElementChild.className = symbols[i];
}

/* Move counter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const moveCounter = document.getElementsByClassName('moves')[0];

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

/* Game State Variables ****************************************************80*/
let nOpens = 0; // A game move here equals an opening of a card.
let nMatches = 0;

// a variable to monitor the number of open cards and their identity
let openCardIndices = [];

/* Auxiliary functions *****************************************************80*/
function lockOpenMatchingCard(cardIndex) {
  closeCard(cardIndex); // Thus, a match empties openCardIndices.
  cardElements[cardIndex].classList.add("match");
}

function checkForMatch() {
  if(cardElements[openCardIndices[0]].firstElementChild.className===
      cardElements[openCardIndices[1]].firstElementChild.className) {
    lockOpenMatchingCard(openCardIndices[1]);
    lockOpenMatchingCard(openCardIndices[0]);
    nMatches++;
  } // Otherwise, openCardIndices.length remains at 2 and the associated
}   // cards are distinct. Thus, any time there are 2 open cards at the
    // start of the click event, those cards are distinct.

function incrementMoveCounter() {
  nOpens++;
  moveCounter.textContent = nOpens;
}

function openCard(i) {
  cardElements[i].classList.add("open", "show");
  openCardIndices.push(i);
  incrementMoveCounter();
  if(openCardIndices.length===2) { // There are 2 cards open.
    checkForMatch();
  }
}

function closeCard(i) {
  cardElements[i].classList.remove("open", "show");
  if(openCardIndices.length===1 || openCardIndices[1]===i)
    openCardIndices.pop();
  else { // openCardIndices.length===2 && openCardIndices[0]===i
    openCardIndices.shift();
  } // if-else here enables player to close either of two open distinct cards,
}   // even though this type of move would reduce the player's performance.

function closeDistinctCards() { // pre-condition: openCardIndices.length===2
  cardElements[openCardIndices.pop()].classList.remove("open", "show");
  cardElements[openCardIndices.pop()].classList.remove("open", "show");
} // A for loop here would require more code, and thus, be less efficient.

/* Event listeners *********************************************************80*/
for( let i=0; i<nCards; i++ ) {
  cardElements[i].addEventListener('click', function() {
    if(cardElements[i].classList.length===1) { // clicked card is closed
      if(openCardIndices.length===2) { // there are two open distinct cards
        closeDistinctCards();
      }
      openCard(i);
    } else if (cardElements[i].classList.contains("open")) {
      // card is open though not matched
      closeCard(i);
    }
    // console.log(openCardIndices); // REMOVE LINE
  });
}
