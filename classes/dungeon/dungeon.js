/**
 * Creates a new dungeon. 
 * @class
 * 
 * @property {Array} map - 2D array storing integer codes
 * @property {Array} shadow - 2D array holding a map of the shadow
 * @property {Boolean} isShadowToggled - is shadow on or off? 
 * @property {HTMLElement} canvas - the DOM element
 * @property {Object} context - the bundle of drawing methods tied to the canvas
 */
class Dungeon {
   constructor(config) {
      this.rooms = [];
      this.curRoomId = 0;

      this.map = [];
      this.shadow = [];

      this.isShadowToggled = false;
      this.doors = []
      this.enemies = [];
      this.canvas = null;
      this.corridoors = []
      this.context = null;
      this.outerLimit = config.outerLimit
      this.cols = config.cols
      this.rows = config.rows
      this.maxRooms = config.maxRooms
      this.base = config.base;
      this.extra = config.extra;
   }
}
/**
 * Reset all level-specific properties
 * 
 */
Dungeon.prototype.reset = function () {
   this.enemies = [];
   this.shadow = [];
   this.map = [];
   this.rooms = []
   this.corridoors = []
}

Dungeon.prototype.inRoom = function ({ x, y }) {
   return this.rooms.find(r => r.encloses(x, y));
}
Dungeon.prototype.inRoomID = function ({ x, y }) {
   var room = this.rooms.find(r => r.encloses(x, y));
   if (room) {
      return room.id
   } else {
      return -1
   }

}
Dungeon.prototype.addPath = function (path) {

   for (var y = path.start.y; y <= path.end.y; ++y) {
      for (var x = path.start.x; x <= path.end.x; ++x) {
         dungeon.map[y][x] = PATH_FLOOR;
         if (!includesXY(dungeon.corridoors, x, y)) {
            dungeon.corridoors.push({ x: x, y: y })
         }

         if (dungeon.map[y - 1][x] == BLANK) {
            dungeon.map[y - 1][x] = PATH_WALL
         }
         if (dungeon.map[y + 1][x] == BLANK) {
            dungeon.map[y + 1][x] = PATH_WALL
         }
         if (dungeon.map[y][x - 1] == BLANK) {
            dungeon.map[y][x - 1] = PATH_WALL
         }
         if (dungeon.map[y][x + 1] == BLANK) {
            dungeon.map[y][x + 1] = PATH_WALL
         }
         if (dungeon.map[y - 1][x - 1] == BLANK) {
            dungeon.map[y - 1][x - 1] = PATH_WALL
         }
         if (dungeon.map[y - 1][x + 1] == BLANK) {
            dungeon.map[y - 1][x + 1] = PATH_WALL
         }
         if (dungeon.map[y + 1][x + 1] == BLANK) {
            dungeon.map[y + 1][x + 1] = PATH_WALL
         }
         if (dungeon.map[y + 1][x - 1] == BLANK) {
            dungeon.map[y + 1][x - 1] = PATH_WALL
         }
      }

   }
}

Dungeon.prototype.resetMap = function () {

   this.map = [];
   // generate a solid wall.
   for (var row = 0; row < dungeon.rows; row++) {
      // create row
      this.map.push([]);

      for (var col = 0; col < dungeon.cols; col++) {
         // create wall
         this.map[row].push(BLANK);
      }
   }

}
Dungeon.prototype.carveRoom = function (room) {

   for (var y = room.start.y; y <= room.end.y; ++y) {
      for (var x = room.start.x; x <= room.end.x; ++x) {
         if (x == room.start.x) {
            this.map[y][x] = ROOM_WALL;
         } else if (x == room.end.x) {
            this.map[y][x] = ROOM_WALL;
         } else if (y == room.start.y) {
            this.map[y][x] = ROOM_WALL;
         } else if (y == room.end.y) {
            this.map[y][x] = ROOM_WALL;
         } else {
            this.map[y][x] = ROOM_FLOOR;
         }

      }
   }
}
Dungeon.prototype.placeDoor = function (room) {

   for (var y = room.start.y; y <= room.end.y; ++y) {
      for (var x = room.start.x; x <= room.end.x; ++x) {
         if (x == room.start.x) {
            if (dungeon.map[y - 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }

            } else if (dungeon.map[y + 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x - 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x + 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            }
         } else if (x == room.end.x) {
            if (dungeon.map[y - 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y + 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x - 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x + 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            }
         } else if (y == room.start.y) {
            if (dungeon.map[y - 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y + 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x - 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x + 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            }
         } else if (y == room.end.y) {
            if (dungeon.map[y - 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y + 1][x] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x - 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            } else if (dungeon.map[y][x + 1] == PATH_FLOOR) {
               if (haveSameData({ x: x, y: y }, room.tl) || haveSameData({ x: x, y: y }, room.tr) || haveSameData({ x: x, y: y }, room.bl || haveSameData({ x: x, y: y }, room.br))) {

               } else {
                  dungeon.map[y][x] = DOOR
                  room.doors.push({ x: x, y: y })
                  dungeon.doors.push({ x: x, y: y })
               }
            }
         } else {
            this.map[y][x] = ROOM_FLOOR;
         }
      }
   }
}
/**
 * 
 * @param {Object} center
 * @param {Number} height
 * @param {Number} width
 * 
 */
Dungeon.prototype.setRoomCoords = function (center, width, height) {

   let halfW = Math.round(width / 2);
   let halfH = Math.round(height / 2);

   let start = {
      x: center.x - halfW,
      y: center.y - halfH
   };

   let end = {
      x: center.x + halfW,
      y: center.y + halfH
   };
   let tl = start
   let br = end
   let tr = {
      x: center.x + halfW,
      y: center.y - halfH
   };
   let bl = {
      x: center.x - halfW,
      y: center.y + halfH
   };
   return {
      start,
      end,
      tl,
      tr,
      bl,
      br

   };

}

/**
 * Randomly generates a set of dimensions.
 * 
 */
Dungeon.prototype.genDim = function () {


   let type = (Math.random() < 0.5) ? 'tall' : 'wide';

   let width, height;

   width = height = dungeon.base;

   let additional = Math.round(Math.random() * dungeon.extra);

   if (type == 'tall') {
      height += additional;
   } else {
      width += additional;
   }
   return {
      width,
      height
   };
};


/**
 * Generates one room based on a center point.
 * @param {Object} center {x,y}
 */
Dungeon.prototype.generateRoom = function (center, width, height) {

   // get coordinates based on width and height
   let { start, end, tl, tr, bl, br } = dungeon.setRoomCoords(center, width, height);

   let room = new Room(center, start, end, tl, tr, bl, br);

   room.id = dungeon.curRoomId;

   return room;

}

Dungeon.prototype.addRoom = function (c) {
   const genCenterCoord = (maxCells, dim) => {
      // get limit on either side based on outer limit and a room dimension - width or height
      let limit = dungeon.outerLimit + Math.round(dim / 2);

      // get range based on cells in array - limit on either side.
      let range = maxCells - 2 * limit;

      // get a random  number within 
      return limit + Math.round(Math.random() * range);
   }
   let {
      width,
      height
   } = dungeon.genDim();

   let coords = c || {
      x: genCenterCoord(dungeon.cols, width),
      y: genCenterCoord(dungeon.rows, height)
   }

   let room = dungeon.generateRoom(coords, width, height);

   for (var dungeonRoom of dungeon.rooms) {

      if (room.overlaps(dungeonRoom, 1)) {
         return null;
      }

   }

   dungeon.curRoomId++;


   dungeon.carveRoom(room);

   dungeon.rooms.push(room);
   return room;

}

/**
 * Generates a series of map rooms
 * 
 */


Dungeon.prototype.generateMapRooms = function () {



   let maxRooms = dungeon.maxRooms;

   for (var i = 0; i < maxRooms; ++i) {
      dungeon.addRoom();
   }
   let success = false;

   const min = 3;

   for (var room of dungeon.rooms) {

      success = room.findFacingRooms(min);

      // make diagonal-only? 
      success = room.nearestNeighbor();

   }
   for (var myRoom of dungeon.rooms) {

      let { numConnected, numDisc } = myRoom.connectRemaining();

      //console.log(`Room${myRoom.id} connected ${numConnected} out of ${numDisc} disconnected rooms`);
   }
   dungeon.addDoors()
   dungeon.eliminateDoubleDoors()
}
Dungeon.prototype.addDoors = function () {
   for (var dungeonRoom of dungeon.rooms) {

      dungeon.placeDoor(dungeonRoom)

   }

}
Dungeon.prototype.eliminateDoubleDoors = function () {
   for (var dungeonRoom of dungeon.rooms) {

      dungeon.checkDoubles(dungeonRoom)

   }

}
Dungeon.prototype.checkDoubles = function (room) {
   for (var y = room.start.y; y <= room.end.y; ++y) {
      for (var x = room.start.x; x <= room.end.x; ++x) {
         if (dungeon.map[y][x] == DOOR) {
            if (dungeon.map[y - 1][x] == DOOR) {
               dungeon.map[y][x] = ROOM_WALL
               // room.doors.push({ x: x, y: y })
            }
            if (dungeon.map[y + 1][x] == DOOR) {
               dungeon.map[y][x] = ROOM_WALL
               // room.doors.push({ x: x, y: y })
            }
            if (dungeon.map[y][x - 1] == DOOR) {
               dungeon.map[y][x] = ROOM_WALL
               //room.doors.push({ x: x, y: y })
            }
            if (dungeon.map[y][x + 1] == DOOR) {
               dungeon.map[y][x] = ROOM_WALL
               //room.doors.push({ x: x, y: y })
            }
         }
      }
   }

}

const haveSameData = function (obj1, obj2) {
   const obj1Length = Object.keys(obj1).length;
   const obj2Length = Object.keys(obj2).length;

   if (obj1Length === obj2Length) {
      return Object.keys(obj1).every(
         key => obj2.hasOwnProperty(key)
            && obj2[key] === obj1[key]);
   }
   return false;
}

function includesXY(a, x, y) { return a.some(e => ((e.x === x) && (e.y === y))); }