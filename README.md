## Matching Game Project

### Abstract
This a browser game project initialized from a starter project from a Udacity web development course. It is a fixed-view single-player game involving a rectangular grid of cards.

### Environment and Technical Features
The game is built with HTML, CSS and JavaScript. The game involves a single view with event listeners, a score panel and a modal. The project is compatible with Chrome 70, Firefox 63 and Edge 42 (EdgeHTML 17). Its responsive design was confirmed with the device and responsiveness tools of Chrome and Firefox.

### App Execution
To run the game, open `./index.html` with a recent version of Chrome, Firefox or Edge, such as those listed above.

### Game Description
This is a one player game about revealing cards by matching. The game has a set of cards comprising only matching pairs. Each card is positioned separately in a rank and file formation. Initially, all cards are face down. A game move occurs when a card becomes face up, by clicking on it. The objective of the game is to reveal all cards, with as few moves as possible.

#### &nbsp;&nbsp;&nbsp; Rules
- At most, two unmatched cards can be face up.
- An attempt to have a third card face up will cause the face up cards to be face down, leaving the attempted third card the only card face up.
- When a match is made, the matching cards remain face up.
- After achieving the objective, a star rating is given to the player based on how many moves the player made.
