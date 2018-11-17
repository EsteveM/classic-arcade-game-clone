# Arcade Game Project

This project is a fully browser-based implementation version of the classic arcade game **Frogger**. The user is presented with a 6 by 5 grid, and can play indefinitely. During the game, the user chooses a player image, avoids enemies (bugs), collects collectibles, and tries to reach water. The user's performance is measured by the points they score, and the moves they make. The main goal is to obtain an outstanding performance, and tell friends to be up to the challenge!

## Table of Contents

* [Description of the Game](#description-of-the-game)
* [Getting Started](#getting-started)
* [Contributing](#contributing)

## Description of the Game

### Initial Set-Up

 The game field is a 6 row by 5 column grid. From top to bottom, the first row is a water one; from the second to the fourth are stone ones; and both the fifth and the sixth rows are grass ones.

 Initially, the player is located randomly within the sixth row, the bottom-most one. Then, three enemies cross horizontally the game field through the stone rows, from left to right. The precise stone row where each enemy appears and their speed are assigned randomly. That means that the grass rows are secure for the player. In addition, five collectibles are placed within the stone rows. Likewise, their exact location is assigned randomly.

 The game also provides a score panel and an image panel. The first one includes two counters which show points won and moves made. User performance will be measured by these two factors. The second one is made up of the five possible player images the user can choose from at any time during the game.

 Now, the game is ready to be played!

### Let's Play

 By pressing key up, down, left or right, the player can move one square correspondingly. Four main events can occur each time the user moves:

 * It can collect a collectible. In this case, 15 points are earned, and the collectible is withdrawn from the screen.
 * It can collide with an enemy. In this case, 60 points are lost, the player is returned to a random position within the bottom-most row, and the four collectibles are again randomly placed within the three stone rows of the game field.
 * It can reach water. In this case, the effect is exactly the same as the one of a collision with an enemy, but now the 60 points are earned, not lost. In addition, the accomplishment of the player is celebrated by a rotation of the image panel.
 * Nothing happens. In this case, everything stays the same, and the user has just changed its location on the game field.

Note that the score panel is not reset at any time during the game. For this reason, the game can be played indefinitely. The user's goal is to obtain an outstanding performance in terms of points and moves, and tell others to be up to
the challenge!

## Getting Started

This is a fully browser-based application, so you will only need a browser to run it. There are no external dependencies.

It is made up of a number of files:

* index.html: It contains the application's HTML code.
* css\style.css: It contains the application's CSS code.
* js\app.js: It contains the application's main JavaScript code. Object properties and behaviour are fully implemented here.
* js\engine.js: It contains the game engine, which provides the game loop functionality.
* js\resources.js: It contains the image loading utility, including a "caching" layer.
* images\: It contains the application's images.
* README.md: It contains the documentation file you are viewing right now.

The application can be started by simply running the index.html file on a browser.

## Contributing

This repository contains all the code that makes up the application. Individuals and I myself are encouraged to further improve this project. As a result, I will be more than happy to consider any pull requests.

