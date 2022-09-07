
const tiles = {
  blank: 0,
  wall: 1,
  floor: 2,
  door: 3,
  corridorWall: 4

};
// Everything relating to the map is in this map object, including the level generation methods
class Map {
  // Hardcoded number of columns for this exercise
  constructor(config) {
    this.columns = config.colums;
    this.spaceFilled = 0, // How much space has been filled?
      this.rows = config.rows,
      this.totalTiles = this.columns * this.rows,
      this.roomOpts = config.roomOpts,
      this.roomTwistiness = config.roomTwistiness,
      this.fillFraction = config.fillFraction,
      this.connectedness = config.connectedness,
      this.monsterFrequency = config.monsterFrequency,
      this.extra = config.numExtraPU,
      this.rooms = [], // Empty array which will store information about each room
      this.items = [],
      this.doors = [],
      this.doorLocations = []
    this.corridorSpace = []
    this.cameras = [],
      this.terrain = []
  }



  // This is the main method that runs to generate the map
  generateMap() {
    //console.log(this.columns*this.rows)
    // Initialize an empty 2d array for the map
    // In this case, this isn't used for actually rendering anything, but IS used to help with the various helper methods
    this.map = [];

    //console.log(this.map2)

    for (let i = 0; i < this.rows; i++) {
      this.map.push(Array(this.columns).fill(tiles.blank));
    }

    //row= y first number
    //col =x second number
    // Use this to break out of the generation loop if shit hits the fan
    let breaker = 0;

    let newRoomRows;
    let newRoomCols;
    let newRoomPos = [-1, -1];

    // This is the main loop that builds the level
    while (this.spaceFilled < this.totalTiles * this.fillFraction) {
      breaker++;
      if (breaker > 1000) {
        break;
      }

      // random room size, based on the size ranges defined in roomOpts
      newRoomRows = this.randomInRange(this.roomOpts.minRows, this.roomOpts.maxRows);
      newRoomCols = this.randomInRange(this.roomOpts.minCols, this.roomOpts.maxCols);

      // If the new room position is outside of the map...
      if (!this.onMap(newRoomPos[0], newRoomPos[1])) {
        // ..choose a new location at random.
        newRoomPos[0] = this.randomInRange(1, this.rows - newRoomRows);
        newRoomPos[1] = this.randomInRange(1, this.columns - newRoomCols);
      } else {
        // OTHERWISE, just shift position slightly.
        newRoomPos[0] += this.randomInRange(-this.roomOpts.minRows, this.roomOpts.minRows);
        newRoomPos[1] += this.randomInRange(-this.roomOpts.minCols, this.roomOpts.minCols);
      }

      // Check if the new room would fit in the selected location, with the selected size      
      if (this.checkSpace(newRoomRows, newRoomCols, newRoomPos[0], newRoomPos[1], this.roomOpts.minSpacing)) {

        // If it fits, it sits! Add the room here.
        this.drawSpace(newRoomRows, newRoomCols, newRoomPos[0], newRoomPos[1]);

        // If this is the second or later room, connect it to an existing room.
        if (this.rooms.length > 1) {
          // Chooses a random number of connections. The max number of attempted connections is the connectedness value, OR the number of rooms available to connect to, whichever is lower.
          const connectionNum = this.randomInRange(1, Math.min(this.connectedness, this.rooms.length - 1));
          for (let i = 0; i < connectionNum; i++) {
            this.addConnection(this.rooms.length - 1, this.nearestRoom(this.rooms.length - 1));
          }
        }
      }
    }

    // Add doors everywhere
    this.addDoors();
    this.addRoomTiles();
    /*   // Next to add the start and end locations
      const startLocation = this.randomInRange(0, this.rooms.length - 1);
      // Slightly badly named method... the "true" makes this instead choose the FURTHEST room for the exist location
      const endLocation = this.nearestRoom(startLocation, true);
  
      this.addEntityToRoom(startLocation, tiles.stairsDown, 'start');
      this.addEntityToRoom(endLocation, tiles.stairsUp, 'end');
  
      //map
      this.addEntityToRoom(3, tiles.map, 'map');
  
      // Populate the rooms with stuff!
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].id = i;
  
        // I like to add at least one item per room, to reward exploration
  
        // Spooky dangerous monster with big teeth!
        // Only add if it's NOT the start location. Also, use math.random for the odds.
        // Getting eaten by a big scary monster the moment you hit go isn't fun. Let them at least take a few steps.
        if (Math.random() < this.monsterFrequency && i !== startLocation) {
          this.addEntityToRoom(i, tiles.enemy, 'enemy');
        }
        if (i !== startLocation) {
          this.addEntityToRoom(i, tiles.camera, 'camera');
        }
        if (i !== endLocation) {
          this.addEntityToRoom(i, tiles.item, 'item');
        }
        if (i !== endLocation && i !== startLocation) {
          for (var c = 0; c < 5; c++) {
            this.addEntityToRoom(i, tiles.crate, 'crate');
          }
  
        }
        // Add an extra monster to the end location. Make the player fight for it.
        if (i === endLocation) {
          this.addEntityToRoom(i, tiles.enemy, 'enemy');
        }
      }
      //extra power ups, if needed
      if (this.extra > 0) {
        for (var i = 0; i < this.extra; i++) {
          let ranRoom = this.randomInRange(0, this.rooms.length - 1);
          this.addEntityToRoom(ranRoom, tiles.item, 'item');
        }
      } */
    /*
  for (let i=1;i<this.rows-1;i++) {
      for (let j=1;j<this.columns-1;j++) {
        // if this is a floor tile...
        if (this.map[i][j] === '.') {
      this.map[i][j] = 2 //floor
    } else if (this.map[i][j] === '#') {
      this.map[i][j] = 1 //wall
    } else if (this.map[i][j] === ' ') {
      this.map[i][j] = 0 //deadspace
    } else if (this.map[i][j] === '$') {
      this.map[i][j] = 3 //item
    }  else if (this.map[i][j] === 'm') {
      this.map[i][j] = 4 //enemy
    } else if (this.map[i][j] === '<') {
      this.map[i][j] = 5 //start
    } else if (this.map[i][j] === '>') {
      this.map[i][j] = 6 //end
    } else if (this.map[i][j] === '+') {
      this.map[i][j] = 7 //door
    } else if (this.map[i][j] === '=') {
      this.map[i][j] = 8 //corridor wall
    } else if (this.map[i][j] === '@') {
      this.map[i][j] = 9 //key
    } else if (this.map[i][j] === 'c') {
      this.map[i][j] = 10 //camera
    }
  	
    }
  }
  for (let i=0;i<this.rows;i++) {
      for (let j=0;j<this.columns;j++) {
        // if this is a floor tile...
        if (this.map[i][j] === ' ') {
      this.map[i][j] = 0
    }
    }
  }
  */
    this.terrain = JSON.parse(JSON.stringify(this.map));
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        // if this is a floor tile...
        if (this.terrain[i][j] === 2) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 1) {

        } else if (this.terrain[i][j] === 0) {

        } else if (this.terrain[i][j] === 3) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 4) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 5) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 6) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 7) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 8) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 9) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 10) {
          this.terrain[i][j] = null
        } else if (this.terrain[i][j] === 11) {
          this.terrain[i][j] = null
        }
      }
    }


    /*console.log(this.items)
    console.log(this.rooms)
    console.log(this.doors)
    console.log(this.rooms)
    console.log(this.cameras)
    console.log(this.terrain)*/
  }

  // This method finds the nearest room!
  // Unless furthest=true, in which case, it finds the furthest room
  nearestRoom(roomID, furthest = false) {

    // This object stores the current best guess.
    const bestRoom = {
      bestRoom: -1,
      bestRoomDist: this.columns ** 2 + this.rows ** 2
    };
    if (furthest) {
      bestRoom.bestRoomDist = -1;
    }
    // Location on the map of the starting room.
    const thisRoomPos = [
      Math.floor((this.rooms[roomID].dimensions[0] + this.rooms[roomID].dimensions[2]) / 2),
      Math.floor((this.rooms[roomID].dimensions[1] + this.rooms[roomID].dimensions[3]) / 2)
    ];

    // Go through each room in the list
    for (let i = 0; i < this.rooms.length; i++) {
      // Skip if self.
      if (i === roomID) {
        continue;
      }
      // Skip if the target room is already connected to the starting room
      if (this.rooms[roomID].connections.includes(i)) {
        continue;
      }

      // Location on the map of the target room
      const nextRoomPos = [
        Math.floor((this.rooms[i].dimensions[0] + this.rooms[i].dimensions[2]) / 2),
        Math.floor((this.rooms[i].dimensions[1] + this.rooms[i].dimensions[3]) / 2)
      ];

      // The square of the distance between the two. The proper way to do this would be to use sqrt(x^2 + y^2), but sqrt is a relatively expensive function and it's not necessary for our purposes. x^2 + y^2 is gets the job done.
      const dist = (nextRoomPos[0] - thisRoomPos[0]) ** 2 + (nextRoomPos[1] - thisRoomPos[1]) ** 2;

      // If the distance is lower than the current best (or higher, if using furthest)...
      if ((dist < bestRoom.bestRoomDist && !furthest) || (dist > bestRoom.bestRoomDist && furthest)) {
        // ... then update the current best room
        bestRoom.bestRoomDist = dist;
        bestRoom.bestRoom = i;
      }
    }
    // Return the ID of the best room choice.
    return bestRoom.bestRoom;
  }

  // This method checks a rectangular region to see if every tile is both within the map, AND currently not occupied by anything else
  checkSpace(rows, cols, startRow, startCol, minSpacing = 0) {
    for (let i = startRow - minSpacing; i < (rows + startRow + minSpacing); i++) {
      for (let j = startCol - minSpacing; j < (cols + startCol + minSpacing); j++) {
        if (!this.onMap(i, j) || this.map[i][j] !== tiles.blank) {
          return false;
        }
      }
    }
    return true;
  }
  //  wSpace(cols, rows, startCol, startRow, floorClass='floor', wallClass='wall', addToRoomList=true, ID=null) {
  //     for (let i=startCol;i<(cols+startCol);i++) {
  //      for (let j=startRow;j<(rows+startRow);j++) {
  //       if (i>startCol && j>startRow && i<(startCol+cols-1) && j<(startRow + rows-1)) {
  // Draws a rectangular room, with floors on the interior, and walls for the edges
  drawSpace(rows, cols, startRow, startCol, floorClass = 'floor', wallClass = 'wall', addToRoomList = true, ID = null) {
    for (let i = startRow; i < (rows + startRow); i++) {
      for (let j = startCol; j < (cols + startCol); j++) {
        if (i > startRow && j > startCol && i < (startRow + rows - 1) && j < (startCol + cols - 1)) {

          this.map[i][j] = tiles.floor;
          this.corridorSpace.push({ x: j, y: i })
          this.spaceFilled++;
        } else {
          if (this.map[i][j] === tiles.blank) {

            if (addToRoomList) {
              this.map[i][j] = tiles.wall;
            } else {
              this.map[i][j] = tiles.corridorWall;
            }

          }
        }
      }
    }
    // Add the new room in the list (if desired. Defaults to true)
    if (addToRoomList) {
      //y,x,yend, xend
      this.rooms.push({
        dimensions: [startRow, startCol, startRow + rows, startCol + cols],
        connections: [],
        id: ID,
        pos: { x: startCol, y: startRow },
        x: startCol,
        y: startRow,
        width: cols,
        height: rows,
        top: startRow,
        bottom: (startRow + rows) - 1,
        left: startCol,
        right: (startCol + cols) - 1,
        size: {
          x: cols,
          y: rows
        },
        area: cols * rows,
        centerX: Math.floor((startCol + startCol + cols) / 2),
        centerY: Math.floor((startRow + startRow + rows) / 2),
        center: {
          x: Math.floor((startCol + startCol + cols) / 2),
          y: Math.floor((startRow + startRow + rows) / 2)
        },
        tiles: this.roomTiles(cols, rows)
      });
      // Place walls around edges of room.
      for (var y = 0; y < this.height; y++) {
        this.setTileAt(0, y, tiles_0.WALL);
        this.setTileAt(width - 1, y, tiles_0.WALL);
      }
      for (var x = 0; x < this.width; x++) {
        this.setTileAt(x, 0, tiles_0.WALL);
        this.setTileAt(x, height - 1, tiles_0.WALL);
      }
      /*var centerX = Math.floor((this.rooms[ID].dimensions[0] + this.rooms[ID].dimensions[2])/2);
        var centerY = Math.floor((this.rooms[ID].dimensions[1] + this.rooms[ID].dimensions[3])/2);
    this.rooms[ID].dimensions.push(centerx)
    this.rooms[ID].dimensions.push(centerY)*/

    }
  }
  roomTiles(cols, rows) {
    var array = create2DArray(cols, rows, tiles.floor)
    for (var y = 0; y < rows; y++) {
      array[y][0] = tiles.wall
      array[y][cols - 1] = tiles.wall
      // this.setTileAt(0, y, tiles_0.WALL);
      // this.setTileAt(cols - 1, y, tiles.wall);
    }
    for (var x = 0; x < cols; x++) {
      array[0][x] = tiles.wall
      array[rows - 1][x] = tiles.wall
      // this.setTileAt(x, 0, tiles_0.WALL);
      //this.setTileAt(x, rows - 1, tiles.wall);
    }
    return array
  }
  // Add a connection from one room to another!
  addConnection(startRoom, endRoom) {
    // Check if the IDs are valid
    if (startRoom === -1 || endRoom === -1) {
      return;
    }
    // Direction determins if we are travelling along rows or columns. Choose a random direction to start
    const direction = [1, 0];
    if (Math.random() > 0.5) {
      direction.reverse();
    }
    // Record that these rooms are being connected
    this.rooms[startRoom].connections.push(endRoom);
    this.rooms[endRoom].connections.push(startRoom);

    // Start position is the center of the start room.
    const position = [
      Math.floor((this.rooms[startRoom].dimensions[0] + this.rooms[startRoom].dimensions[2]) / 2),
      Math.floor((this.rooms[startRoom].dimensions[1] + this.rooms[startRoom].dimensions[3]) / 2),
    ];
    // end position is the center of the end room
    const endPosition = [
      Math.floor((this.rooms[endRoom].dimensions[0] + this.rooms[endRoom].dimensions[2]) / 2),
      Math.floor((this.rooms[endRoom].dimensions[1] + this.rooms[endRoom].dimensions[3]) / 2),
    ];

    let breaker = 0;
    // While not at the end position...
    while (breaker < 200 && (endPosition[0] !== position[0] || endPosition[1] !== position[1])) {
      breaker++;

      // Randomly decide whether to change direction, to add "twistiness"
      if (Math.random() < this.roomTwistiness) {
        direction.reverse();
      }

      // If lined up in a column, always travel vertically
      if (endPosition[0] === position[0] && direction[0] === 1) {
        direction.reverse();
      }
      // if lined up in a row, always travel horizontally
      else if (endPosition[1] === position[1] && direction[1] === 1) {
        direction.reverse();
      }

      // Take a step in that direction.
      // Math.sign returns +1, -1, or 0, and direction is either [1,0] or [0,1], this will always take a step by 1 tile towards the end position, along the currently preferred axis.
      position[0] += Math.sign(endPosition[0] - position[0]) * direction[0];
      position[1] += Math.sign(endPosition[1] - position[1]) * direction[1];

      // Take advantage of the room drawing algorithm we already wrote! But, don't record it as a room in this.rooms. Note, floors override walls, so this will carve out a hallway regardless of whatever happens to be in the way.
      this.drawSpace(3, 3, position[0] - 1, position[1] - 1, 'hallFloor', 'hallWall', false);
    }
  }
  //add tile map for each room
  addRoomTiles() {

  }
  // Doors are a pain, and you can take them or leave them.
  // This method tries to add them but to be blunt I've never been 100% happy with any door adding algorithm.
  addDoors() {
    // Go through every tile on the map
    var count = 0;
    for (let i = 1; i < this.rows - 1; i++) {
      for (let j = 1; j < this.columns - 1; j++) {
        // if this is a floor tile...
        if (this.map[i][j] === tiles.floor) {

          // record the neighbouring walls, either on opposite columns or opposite rows
          let walls = [0, 0];
          for (let ii = -1; ii < 2; ii++) {
            for (let jj = -1; jj < 2; jj++) {
              // Neighbouring wall?
              if (this.map[i + ii][j + jj] === tiles.wall) {
                // Opposite rows?
                if (ii === 0) {
                  walls[1]++;
                }
                // Opposite columns?
                if (jj === 0) {
                  walls[0]++;
                }
              }
            }
          }
          // If there's a wall on opposite orthogonal sides, and the space is inside of a room, it might be a good place for a door.
          if ((walls[0] === 2 || walls[1] === 2) && this.inRoom(i, j)) {

            this.doors.push({
              doorID: count,
              roomID: this.getRoomID(i, j),
              x: j,
              y: i
            })
            this.map[i][j] = tiles.door;
            var roomId = this.getRoomID(i, j)
            this.rooms[roomId].tiles[i - this.rooms[roomId].y][j - this.rooms[roomId].x] = tiles.door
            count++;
          }
        }
      }
    }
  }

  // Helper method. Checks if the given position is inside of a room.
  inRoom(row, col) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (row >= this.rooms[i].dimensions[0] && row < this.rooms[i].dimensions[2] && col >= this.rooms[i].dimensions[1] && col < this.rooms[i].dimensions[3]) {

        return true;
      }
    }
    return false;
  }
  getRoomID(row, col) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (row >= this.rooms[i].dimensions[0] && row < this.rooms[i].dimensions[2] && col >= this.rooms[i].dimensions[1] && col < this.rooms[i].dimensions[3]) {

        return i;
      }
    }
    return false;
  }
  // Add an entity to a room
  /*  addEntityToRoom(roomID, entitySymbol = tiles.collectable, entityClass = 'item') {
     // The entity goes within the rooms walls
     const roomEdges = this.rooms[roomID].dimensions;
     let breaker = 0;
     while (breaker < 100) {
       // random location within the room
       // [startRow, startCol, startRow+rows, startCol+cols],
       const tryPosition = [
         this.randomInRange(roomEdges[0] + 1, roomEdges[2] - 2),
         this.randomInRange(roomEdges[1] + 1, roomEdges[3] - 2)
       ];
       // Confirm it's on the map to be safe. Check if it is an empty floor.
       if (this.onMap(tryPosition[0], tryPosition[1]) &&
         this.map[tryPosition[0]][tryPosition[1]] === tiles.floor) {
         // If it is? Add the object, and then break out of the loop.
         if (entityClass == 'item') {
           if (Math.random() < .5) {
             entitySymbol = tiles.collectable;
           } else {
             entitySymbol = tiles.tech
           }
         }
 
 
         this.map[tryPosition[0]][tryPosition[1]] = entitySymbol;
 
         if (entityClass == 'item') {
           var temp = itemTypes[this.randomInRange(0, itemTypes.length - 1)]
         } else {
           var temp = null
         }
 
 
         if (entityClass == 'camera') {
           this.cameras.push({
             type: entityClass,
             room: roomID,
             x: tryPosition[1],
             y: tryPosition[0]
           })
         }
 
         this.items.push({
           type: entityClass,
           room: roomID,
           x: tryPosition[1],
           y: tryPosition[0],
           subType: temp
         })
 
         break;
       }
       breaker++;
     }
   } */

  // Helper method. Is the given location even on the map?
  onMap(row, col) {
    return (col >= 0 && row >= 0 && col < this.columns && row < this.rows);
  }


  // Used to get a random number between min and max, inclusive both min and max!
  randomInRange(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
  }
  getDoorLocations(room) {

    var doors = [];
    for (var y = 0; y < room.height; y++) {
      for (var x = 0; x < room.width; x++) {
        if (room.tiles[y][x] == tiles.door) {
          doors.push({ x: x, y: y });
        }
      }
    }
    return doors;
  }
  getTerrainMap() {
    return this.terrain
  }
  getMap() {
    return this.map
  }
  getRooms() {
    return this.rooms
  }
  getCorridors() {
    return this.corridorSpace
  }
  getItems() {
    return this.items
  }
  getCameras() {
    return this.cameras
  }
  getDoors() {
    return this.doors
  }

}
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
function create2DArray(width, height, value) {
  return __spreadArrays(Array(height)).map(function () { return Array(width).fill(value); });
}