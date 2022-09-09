
/**
 * Classes 
 */


/**
* Creates a new game. 
* @class
* 
* @property {Array} map - 2D array storing integer codes
* @property {Array} shadow - 2D array holding a map of the shadow
* @property {Boolean} isShadowToggled - is shadow on or off? 
* @property {HTMLElement} canvas - the DOM element
* @property {Object} context - the bundle of drawing methods tied to the canvas
*/
class Cave {
  constructor(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.map = [];

    this.canvas = null;

    this.context = null;
  }
}
/**
* Reset all level-specific properties
* 
*/
Cave.prototype.reset = function () {
  this.enemies = [];
  this.shadow = [];
  this.map = [];
}

/**
* The generate map function
* 
* This algorithmm starts in the center and works its way outward.
*/

Cave.prototype.generateMap = function () {
  // generate a solid wall.
  for (var row = 0; row < this.rows; row++) {
    // create row
    cave.map.push([]);

    for (var col = 0; col < this.cols; col++) {
      // create wall
      cave.map[row].push(BLANK);
    }
  }
  // set up total number of tiles used
  // and the total number of penalties made


  let pos = {
    x: this.cols / 2,
    y: this.rows / 2
  };

  const ATTEMPTS = 30000;
  const MAX_PENALTIES_COUNT = 1000;
  const MINIMUM_TILES_AMOUNT = 1000;
  const OUTER_LIMIT = 3;

  const randomDirection = () => Math.random() <= 0.5 ? -1 : 1;

  let tiles = 0, penalties = 0;

  for (var i = 0; i < ATTEMPTS; i++) {

    // choose an axis to dig on.
    let axis = Math.random() <= 0.5 ? 'x' : 'y';

    // get the number of rows or columns, depending on the axis.
    let numCells = axis == 'x' ? this.cols : this.rows;

    // choose the positive or negative direction.
    pos[axis] += randomDirection();

    // if we are on the far left or far right, find another value.

    // we don't want to dig here so let's find a way to get out
    while (pos[axis] < OUTER_LIMIT || pos[axis] >= numCells - OUTER_LIMIT) {

      pos[axis] += randomDirection();

      penalties++;

      if (penalties > MAX_PENALTIES_COUNT) {

        // if we have used up our tiles, we're done.
        if (tiles >= MINIMUM_TILES_AMOUNT) {
          return;
        }
        // bring coords back to center
        pos.x = this.cols / 2;
        pos.y = this.rows / 2;
      }
    }

    let { x, y } = pos;

    // if not a floor, make this a floor
    if (cave.map[y][x] != ROOM_FLOOR) {

      cave.map[y][x] = ROOM_FLOOR;
      // we use up a tile.
      tiles++;
    }
    penalties = 0;

  } // end the large loop
}




/**
* Coordinate Helper Functions
*/


function pickRandom(arr) {
  let idx = Math.floor(Math.random() * arr.length);

  return arr[idx];
}
/**
* @param {Number} amount
* 
*/
