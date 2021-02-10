/* Viewport view ***********************************************************80*/
// When viewport window is smaller than game content, upon page load,
// scroll view so that game is horizontally centered.

document.addEventListener('DOMContentLoaded', function () {
  const windowWidth = window.innerWidth - 17;
  /* 17 px is browswer scroll bar width on Chrome and FireFox.
     TODO: This correction should be automatically determined. Touch screen
     mode without scroll bars should not have a correction. */
  const deckWidth =
    document.getElementsByClassName('deck')[0].getBoundingClientRect().width;
  if( windowWidth < deckWidth ) {
    window.scroll( (deckWidth - windowWidth)/2, 0);
  }
});

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

/* Game State Variables ****************************************************80*/
const nStarsMax = 3;
const maxViews3stars = 24;
const maxViews2stars = 27;
const minCount3stars = 20;
let nStars = nStarsMax; // Player performance is initialized as perfect.
let nViews = 0; // A view is an opening of a card.
let nMatches = 0;

// a variable to monitor the number of open cards and their identity
let openCardIndices = [];

/* HTML Elements ***********************************************************80*/

/* List of shuffled cards - - - - - - - - - - - - - - - - - - - - - - - - - - */

// String array of card symbols
let symbols = ["fas fa-gem", "fas fa-paper-plane", "fas fa-anchor",
  "fas fa-bolt", "fas fa-cube", "fas fa-leaf", "fas fa-bicycle", "fas fa-bomb"];
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

/* Star - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const star = document.createElement('li');
star.innerHTML = `<i class="fas fa-star"></i>`

/* Empty star - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const emptyStar = document.createElement('li');
emptyStar.innerHTML = `<i class="far fa-star"></i>`

/* Star rating  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const starsList = document.createElement('ul');
starsList.classList.add("starsField");

/* Card view count- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const viewCounter = document.getElementsByClassName('views')[0];

/* Elapsed time in seconds- - - - - - - - - - - - - - - - - - - - - - - - - - */
const timerElement = document.getElementsByClassName('digitalTime')[0];

/* Reset button - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const resetFromGame = document.getElementsByClassName('resetField')[0];

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the card view counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* Auxiliary functions *****************************************************80*/
const resetFunction = function() {
  window.location.reload(); // reload page
}

function showTimeUpEndModal() {
  // set singular or plural word depending on its associated quantity's value
  const matchWord = nMatches===1 ? "match" : "matches";
  const viewWord = nViews===1 ? "view" : "views";

  // define modal
  const endModal = document.createElement('div');
  endModal.className="modal";

  endModal.innerHTML =
   `<h1><i class="big fas fa-hourglass-end"></i></h1>
    <h1>Time's up!</h1>
    ${starsList.outerHTML}
    <h1>${nMatches} ${matchWord}<br>in ${nViews} ${viewWord}</h1>
    <div class="modalResetField" title="Play again?">
      <i class="fas fa-redo-alt"></i>
    </div>`;

  // render modal
  document.getElementsByTagName('body')[0].appendChild(endModal);

  // activate in-modal reset button
  document.getElementsByClassName('modalResetField')[0].addEventListener(
    'click', resetFunction
  );
}

function buildEmptyStars() {
  starsList.appendChild(emptyStar);
  for( let i=1; i<nStarsMax; i++ ) {
    starsList.appendChild(document.createTextNode(' '));
    starsList.appendChild(emptyStar.cloneNode(true));
  }
}

function lockUnmatchedCards() {
  for( let i=0; i<nCards; i++ )
    if(!cardElements[i].classList.contains("match")) {
      if(cardElements[i].classList.contains("open"))
        cardElements[i].classList.remove("point");
      cardElements[i].removeEventListener('click', flipCardFunctions[i]);
      cardElements[i].classList.add("lock"); // set pointer to default
    }
}

function showTopMeritEndModal() {
  // determine digital clock display for representing spent time
  count++; // Undo count offset: let count = initialSecondsCount - 1;
  const secondsSpent = initialSecondsCount - count;
  const clockMinutes = Math.floor(secondsSpent / 60);
  let clockSeconds = secondsSpent % 60;
  clockSeconds = clockSeconds < 10 ? "0" + clockSeconds : clockSeconds;
  const digitalClock = clockMinutes + ":" + clockSeconds;

  // define modal
  const endModal = document.createElement('div');
  endModal.className="modal";

  endModal.innerHTML =
   `<h1><i class="big fas fa-medal"></i></h1>
    <h1>You've achieved mastery!</h1>
    ${starsList.outerHTML}
    <h1>${nViews} views<br>in ${digitalClock} [m:ss]</h1>`;

  // render modal
  document.getElementsByTagName('body')[0].appendChild(endModal);
}

function showMeritEndModal() {
  // determine digital clock display for representing spent time
  count++; // Undo count offset: let count = initialSecondsCount - 1;
  const secondsSpent = initialSecondsCount - count;
  const clockMinutes = Math.floor(secondsSpent / 60);
  let clockSeconds = secondsSpent % 60;
  clockSeconds = clockSeconds < 10 ? "0" + clockSeconds : clockSeconds;
  const digitalClock = clockMinutes + ":" + clockSeconds;

  // define modal
  const endModal = document.createElement('div');
  endModal.className="modal";

  endModal.innerHTML =
   `<h1><i class="big fas fa-award"></i></h1>
    <h1>Matches Completed!</h1>
    ${starsList.outerHTML}
    <h1>${nViews} views<br>in ${digitalClock} [m:ss]</h1>
    <div class="modalResetField" title="Play again?">
      <i class="fas fa-redo-alt"></i>
    </div>`;

  // render modal
  document.getElementsByTagName('body')[0].appendChild(endModal);

  // activate in-modal reset button
  document.getElementsByClassName('modalResetField')[0].addEventListener(
    'click', resetFunction
  );
}

function buildStarsList() {
  let nEmptyStars = nStarsMax - nStars;
  starsList.appendChild(star);
  for( let i=1; i<nStars; i++ ) {
    starsList.appendChild(document.createTextNode(' '));
    starsList.appendChild(star.cloneNode(true));
  }
  for( let i=0; i<nEmptyStars; i++ ) {
    starsList.appendChild(document.createTextNode(' '));
    starsList.appendChild(emptyStar.cloneNode(true));
  }
}

function endGame() {
  window.clearInterval(timer); // stop the timer

  // right align timer text
  document.getElementsByClassName('timerField')[0].classList.add("alignRight");

  // remove reset button on game score panel
  resetFromGame.remove();

  if(count>-1) {
    buildStarsList();
    if(nStars<nStarsMax)
      showMeritEndModal();
    else
      showTopMeritEndModal();
  }
  else {
    lockUnmatchedCards();
    buildEmptyStars();
    showTimeUpEndModal();
  }
}

function lockOpenMatchingCard(cardIndex) {
  closeCard(cardIndex); // remove openCardIndex and excess dom element classes
  cardElements[cardIndex]
    .removeEventListener('click', flipCardFunctions[cardIndex]);
  cardElements[cardIndex].classList.add("match");
}

function checkForMatch() {
  if(cardElements[openCardIndices[0]].firstElementChild.className===
      cardElements[openCardIndices[1]].firstElementChild.className) {
    lockOpenMatchingCard(openCardIndices[1]);
    lockOpenMatchingCard(openCardIndices[0]);
    nMatches++;
    if(nMatches===nSymbols){ // The game objective is achieved.
      // When matches compeleted in nViews < maxViews3stars, remove star if
      // count < minCount3stars.
      if( nViews < maxViews3stars  &&  count < minCount3stars )
        nStars--;
      endGame();
    }
  } // Otherwise, openCardIndices.length remains at 2 and the associated
}   // cards are distinct.

function incrementMoveCounter() {
  nViews++;
  viewCounter.textContent = nViews;
  // Remove star when nViews is maxViews3stars and maxViews2stars.
  // Completion earns at least 1 star.
  if(nViews===maxViews3stars)
    nStars--;
  else if(nViews===maxViews2stars)
    nStars--;
}

function closeCard(i) {
  cardElements[i].classList.remove("open", "point");
  if(openCardIndices.length===1 || openCardIndices[1]===i)
    openCardIndices.pop();
  else { // openCardIndices.length===2 && openCardIndices[0]===i
    openCardIndices.shift();
  } // if-else here enables player to close either of two open distinct cards
}

function openCard(i) {
  cardElements[i].classList.add("open", "point");
  openCardIndices.push(i);
  incrementMoveCounter();
  if(openCardIndices.length===2) { // There are 2 cards open.
    checkForMatch();
  }
}

function closeDistinctCards() { // pre-condition: openCardIndices.length===2
  cardElements[openCardIndices.pop()].classList.remove("open", "point");
  cardElements[openCardIndices.pop()].classList.remove("open", "point");
} // A for loop here would require more code, and thus, be less efficient.

const flipCardFunctions = [];

for( let i=0; i<nCards; i++ )
  flipCardFunctions.push(function() {
    if(cardElements[i].classList.length===1) { // clicked card is closed
      if(openCardIndices.length===2) { // there are two open distinct cards
        closeDistinctCards();
      }
      openCard(i);
    } else if (cardElements[i].classList.contains("open")) {
      // card is open though not matched
      closeCard(i);
    }
  });

/* Game-Play Event listeners ***********************************************80*/
for( let i=0; i<nCards; i++ )
  cardElements[i].addEventListener('click', flipCardFunctions[i]);

resetFromGame.addEventListener('click', resetFunction);

/* Timer: a basic timer that counts down seconds ***************************80*/
const initialSecondsCount = 80;
let minutes = Math.floor(initialSecondsCount / 60);
let seconds = initialSecondsCount % 60;
seconds = seconds < 10 ? "0" + seconds : seconds;
timerElement.textContent = minutes + ":" + seconds;

let count = initialSecondsCount - 1;
const timer = window.setInterval(function() {
  minutes = Math.floor(count / 60);
  seconds = count % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timerElement.textContent = minutes + ":" + seconds;

  if (count-- === 0) endGame();
}, 1000);
