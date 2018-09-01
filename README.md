## Matching Game Project

### Abstract
This a browser game project for Section 3 of the Udacity Front-End Web Development Nanodegree. Section 3 introduces the Document Object Model and JavaScript. The game involves a single view with event listeners, a score panel and a game ending modal.

### Environment
The game is built with HTML, CSS and JavaScript. It has been tested with Chrome and FireFox, and their respective device and responsiveness tools.

### Game Description
This is a one player game about revealing cards by matching. There is a copy of each card. Initially, all cards are visible, face down. Each card is positioned in a cell of a regular uniform grid. The objective of the game is to reveal all cards, with as few card-opens as possible.

#### &nbsp;&nbsp;&nbsp; Rules
- At most, two unmatched cards can be open.
- An attempt at opening a third card will cover the prior two cards, leaving the attempted third card as the only open card.
- When a match is made, the matching cards remain open.
- After achieving the objective, a star rating is given to the player based on how many card-opens the player executed.
