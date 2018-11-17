//***************************************************************************
//          COLLECTIBLE CLASS
//***************************************************************************
// This class implements our collectibles, and has a number of properties and
// methods:
//             - sprite: this is the image for our collectible.
//             - x and y: this is the location for the collectible. x represents
//               the column, and y the row. Initially, any of the three
//               stone rows (y) , and any of the columns (x) are possible, and
//               the chosen ones are calculated randomly.
//               The method used to perform the random assignment is based on
//               the stonePoolForCollectibles array. This array contains all
//               the possible pairs column and row. These pairs are previously
//               randomly ordered. This method ensures that only one collectible
//               occupies a given square.
//               The resulting row or column is then multiplied by the
//               number of pixels per row (83) or per column (101)
//               respectively.
// The methods of the player can be seen below, where they are also commented.
// These are: update, render, and collectionDetection.
//
var Collectible = function(index) {
    this.sprite = 'images/gem-green.png';
    const [x,y] = stonePoolForCollectibles[index];
    this.y = y * pixelsPerRow;
    this.x = x * pixelsPerColumn;
};

//          *************
//          METHOD UPDATE
//          *************
// Function to update the collectible's position, required method for the game.
// The position of the collectible is only re-assigned when it is collected, or
// when the game is reset. See the collectionDetection method of the
// collectible or the reset method of the player respectively for that.
//
Collectible.prototype.update = function() {
    this.collectionDetection();
};

//          *************
//          METHOD RENDER
//          *************
// Draw the collectible on the screen, required method for the game.
//
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//          **************************
//          METHOD COLLECTIONDETECTION
//          **************************
// Function to detect collections. A collection occurs whenever the square
// where the collectible is located coincides with the one of the player. In
// this event, the collectible is situated off screen, which provides the
// illusion of a collection by the player. In addition, the score of the player
// is incremented by the number of points determined for a collection.
//
Collectible.prototype.collectionDetection = function() {
    if ((this.x === player.x) && (this.y === player.y)) {
        this.x = maxPixelsWidth;
        player.score += pointsPerGreenGem;
        document.querySelector('.score').textContent = `${player.score} Points`;
    }
};

//***************************************************************************
//          ENEMY CLASS
//***************************************************************************
// This class implements our enemy, and has a number of properties and
// methods:
//             - sprite: this is the image for our enemy.
//             - x and y: this is the location for the enemy. x represents
//               the column, and y the row. Initially, any of the three
//               stone rows (y) is possible, and the chosen one is calculated
//               randomly. In addition, initially, only one column (x) is
//               possible, the left-most one. That is, column 0.
//               The resulting row or column is then multiplied by the
//               number of pixels per row (83) or per column (101)
//               respectively.
//             - speed: the speed for our enemies is set randomly. It can be
//               up to maxEnemySpeed columns per tick. The resulting number of
//               columns is then multiplied by the number of pixels per
//               column (101).
// The methods of the player can be seen below, where they are also commented.
// These are: update, render, endOfCanvasDetection, and collisionDetection.
//
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.y = (Math.floor(Math.random() * numberOfStoneRows) + 1) * pixelsPerRow;
    this.x = 0;
    this.speed = (Math.floor(Math.random() * maxEnemySpeed) + 1) *
                pixelsPerColumn;
};

//          *************
//          METHOD UPDATE
//          *************
// Function to update the enemy's position, required method for the game. It
// receives dt as a parameter, a time delta between ticks. Any movement is
// multiplied by the dt parameter so that it is ensured that the game runs at
// the same speed for all computers.
// The row (y) where the enemy is positioned is re-assigned when the enemy
// reaches the end of the game field only. The column (x) of the enemy equals
// the previous one plus the distance covered per tick (its speed). Again it is
// only re-assigned when the end of the game field is reached. Then, it is set
// to the left-most one. See the endOfCanvasDetection method for that.
//
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    this.endOfCanvasDetection();
    this.collisionDetection();
};

//          *************
//          METHOD RENDER
//          *************
// Draw the enemy on the screen, required method for the game.
//
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//          ***************************
//          METHOD ENDOFCANVASDETECTION
//          ***************************
// Function to detect that the enemy has reached the end of the game field.
// In this event, the enemy location is set to the first column and to any of
// the three stone rows. The precise column out of the three possible ones is
// determined randomly. In addition, the speed of the enemy is also set
// randomly.
//
Enemy.prototype.endOfCanvasDetection = function() {
    if (this.x > maxPixelsWidth) {
        this.x = 0;
        this.y = (Math.floor(Math.random() * numberOfStoneRows) + 1) *
                pixelsPerRow;
        this.speed = (Math.floor(Math.random() * maxEnemySpeed) + 1) *
                pixelsPerColumn;
    }
};

//          *************************
//          METHOD COLLISIONDETECTION
//          *************************
// Function to detect collisions. A collision occurs whenever the position of
// the enemy covers (partly or completely) the square where the player is
// located. In this event, the game is reset, and the score of the player is
// reduced by the number of points determined for a collision.
//
Enemy.prototype.collisionDetection = function() {
    if (((this.x + pixelsPerColumn) > player.x) &&
        (this.x < (player.x + pixelsPerColumn)) &&
        (this.y === player.y)) {
            player.reset();
            if (player.score >= pointsPerCollision) {
                player.score -= pointsPerCollision;
            } else {
                player.score = 0;
            }
            document.querySelector('.score').textContent =
                `${player.score} Points`;
    }
};

//***************************************************************************
//          PLAYER CLASS
//***************************************************************************
// This class implements our player, and has a number of properties and
// methods:
//             - sprite: this is the image for our player.
//             - x and y: this is the location for the player. x represents
//               the column, and y the row. Initially, only one row is
//               possible, the bottom-most one. That is, row 6. In addition,
//               initially, any column is possible, and the chosen one is
//               calculated randomly.
//               The resulting row or column must then be multiplied by the
//               number of pixels per row (83) or per column (101)
//               respectively.
//             - moves: the number of moves made by the player since the
//               game was loaded on the browser. Initially set to zero.
//             - score: the number of points earned by the player since the
//               game was loaded on the browser. Initially set to zero.
// The methods of the player can be seen below, where they are also commented.
// These are: update, render, handleInput, reset, and choosePlayer.
//
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.y = (numberOfRows - 1) * pixelsPerRow;
    this.x = (Math.floor(Math.random() * numberOfColumns)) * pixelsPerColumn;
    this.moves = 0;
    this.score = 0;
};

//          *************
//          METHOD UPDATE
//          *************
// This method is kept for compatibility reasons. It was intended to be
// used to update the player's position. However, it is not needed in our
// implementation. Please note that the method is still called from the
// engine (engine.js). Nevertheless, that call could be deleted without
// any negative implications.
//
Player.prototype.update = function() {
};

//          *************
//          METHOD RENDER
//          *************
// Draw the player on the screen, required method for the game.
//
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//          ******************
//          METHOD HANDLEINPUT
//          ******************
// This function receives the keys pressed by the user. This will determine
// the new position of the player, and the current number of moves to be shown
// at the score panel.
// If the player reaches water, this will also be celebrated by rotating the
// image panel (the five possible images the user can choose from for their
// player). In addition, the game will be reset, and a number of points will
// be added to the player's score.
//
Player.prototype.handleInput = function(keyCode) {

    switch(keyCode) {
        case 'left':  {
            if (this.x > 0) {
                this.x -= pixelsPerColumn;
                this.moves += 1;
            }
            break;
        }
        case 'right':  {
            if (this.x !== (maxPixelsWidthDraw)) {
                this.x += pixelsPerColumn;
                this.moves += 1;
            }
            break;
        }
        case 'up': {
            this.moves += 1;
            if (this.y > pixelsPerRow   ) {
                this.y -= pixelsPerRow;
            } else {
                if (document.querySelector('.images').classList.contains('win')) {
                    document.querySelector('.images').classList.remove('win');
                } else {
                    document.querySelector('.images').classList.add('win');
                }
                player.reset();
                player.score += pointsPerReachWater;
                document.querySelector('.score').textContent =
                    `${player.score} Points`;
            }
            break;
        }
        case 'down': {
            if (this.y !== (maxPixelsHeightDraw)) {
                this.y += pixelsPerRow;
                this.moves += 1;
            }
            break;
        }
    }
    if (this.moves === 1) {
        document.querySelector('.moves').textContent = `1 Move`;
    } else {
        if (this.moves > 1) {
            document.querySelector('.moves').textContent = `${this.moves} Moves`;
        }
    }
};

//          ************
//          METHOD RESET
//          ************
// This function resets the game. The player location is set to a random
// column at the bottom-most row of the game field. In addition, collectibles
// are randomly situated within the three stone rows of the game field.
//

Player.prototype.reset = function() {
    this.y = (numberOfRows - 1) * pixelsPerRow;
    this.x = (Math.floor(Math.random() * numberOfColumns)) * pixelsPerColumn;
    stonePoolForCollectibles = shuffle(stonePoolForCollectibles);
    let i = 0;
    let x = 0;
    let y = 0;
    for (const collectible of allCollectibles) {
        [x,y] = stonePoolForCollectibles[i];
        collectible.y = y * pixelsPerRow;
        collectible.x = x * pixelsPerColumn;
        i += 1;
    }
};

//          *******************
//          METHOD CHOOSEPLAYER
//          *******************
// This function allows the user to choose the image they want for
// the player at any time during the game. To this end, the user can
// click the desired image on the screen. The property "sprite" will be
// re-assigned accordingly.
//

Player.prototype.choosePlayer = function(event) {
    const image = event.target.classList.item(0);
    switch(image) {
        case 'boy':  {
            this.sprite = 'images/char-boy.png';
            break;
        }
        case 'cat-girl':  {
            this.sprite = 'images/char-cat-girl.png';
            break;
        }
        case 'horn-girl': {
            this.sprite = 'images/char-horn-girl.png';
            break;
        }
        case 'pink-girl': {
            this.sprite = 'images/char-pink-girl.png';
            break;
        }
        case 'princess-girl': {
            this.sprite = 'images/char-princess-girl.png';
            break;
        }
    }
};

//          ****************
//          FUNCTION SHUFFLE
//          ****************
// SHUFFLE: Function from http://stackoverflow.com/a/2450976
//          to shuffle an array

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

//          ****************************
//          DEFINITION OF GAME CONSTANTS
//          ****************************
// numberOfCollectibles: number of collectibles on the screen at the
//                       beginning of the game, or after a reset.
// numberOfEnemies: number of enemies on the screen at any given time.
// maxEnemySpeed: number of columns covered by an enemy per tick. Please,
//                note that this is adjusted by dt to ensure a common
//                user experience regardless of the computer of the user.
// pixelsPerRow: number of pixels per row on the game field.
// pixelsPerColumn: number of pixels per column on the game field.
// maxPilxelsWidth: number of pixels that the game field width has.
// maxPixelsWidthDraw: number of pixels that the game field width has minus
//                     one column. This is the maximum x for a player.
// maxPixelsHeightDraw: number of pixels that the game field height has minus
//                      one row. This is the maximum y for a player.
// pointsPerCollision: number of points that the user loses when the player
//                     and any enemy collide.
// pointsPerReachWater: number of points that the user wins when reaches water.
// pointsPerGreenGem: number of points that the user wins when collects a green
//                    gem.

const numberOfCollectibles = 5;

const numberOfEnemies = 3;
const maxEnemySpeed = 4;

const numberOfRows = 6;
const numberOfColumns = 5;
const numberOfStoneRows = 3;
const pixelsPerRow = 83;
const pixelsPerColumn = 101;
const maxPixelsWidth = 505;
const maxPixelsWidthDraw = 404;
const maxPixelsHeightDraw = 415;

const pointsPerCollision = 60;
const pointsPerReachWater = 60;
const pointsPerGreenGem = 15;

//          ************************
//          STONEPOOLFORCOLLECTIBLES
//          ************************
// stonePoolForCollectibles is an array. Each one of its elements is an array
// representing the coordinates [x,y] of the stone part of the game field.
// This array is sorted so that the collectibles (gems) are placed randomly on
// the game field when the game is first loaded and after a restart.
//

let stonePoolForCollectibles = [[0,1],[0,2],[0,3],[1,1],[1,2],[1,3],[2,1],[2,2],
                                [2,3],[3,1],[3,2],[3,3],[4,1],[4,2],[4,3]];
stonePoolForCollectibles = shuffle(stonePoolForCollectibles);

//          ********************
//          OBJECT INSTANTIATION
//          ********************
// All collectible objects are placed in an array called allCollectibles
// All enemy objects are placed in an array called allEnemies
// The player object is placed in a variable called player
//

let allCollectibles = [];
for (let i = 0; i < numberOfCollectibles; i++) {
    allCollectibles.push(new Collectible(i));
}

let allEnemies = [];
for (let i = 0; i < numberOfEnemies; i++) {
    allEnemies.push(new Enemy());
}

let player = new Player();

//          *****************************
//          EVENTLISTENER FOR KEY PRESSES
//          *****************************
// This listens for key presses and sends the keys to the
// player.handleInput() method. The main goal is to manage
// the movement of the player.
//

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//          **************************************
//          EVENTLISTENER FOR CLICKS ON THE IMAGES
//          **************************************
// This listens for clicks on the images and sends them
// to the player.choosePlayer() method. The main goal is
// to allow the user to choose the image they want for
// the player at any time during the game.
//

let images = document.querySelector('.images');
images.addEventListener('click', function(e) {
    player.choosePlayer(e);
});