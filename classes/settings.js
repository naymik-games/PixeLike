let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}
let objects
let breakables
let doorGroup

const EVENTS_NAME = {
  gameEnd: 'game-end',
  chestLoot: 'chest-loot',
  attack: 'attack',
  smash: 'smash'
}
const AGRESSOR_RADIUS = 100;
let gameData;
var defaultValues = {
  playerData: {
    hp: 50,
    hpMax: 50,
    gold: 0,
    power: 1,//base strength
    strength: 1,//multiplier ie 1 * 1.2
    defense: 1,
    critical: 0,
    speed: 110,
    magic: 0,
    magicMax: 0,
    immuneTime: 300,
    skillLevel: 1,
    skillProgress: 0,
    skillGoal: 100,
    onLevel: 1,
    inventory: []
  }

}
let heroKey = 'hero1'
let onLevel = 0
//new version
/* let levels = [
  {},

  {
    dungeon: {
      size: [200, 200],
      //seed: 'abcd', //omit for generated seed
      rooms: {
        initial: {
          min_size: [3, 5],
          max_size: [3, 5],
          max_exits: 1,
          position: [0, 0] //OPTIONAL pos of initial room 
        },

        any: {
          min_size: [5, 5],
          max_size: [8, 8],
          max_exits: 4
        }
      },
      max_corridor_length: 15,//8
      min_corridor_length: 3,//2
      corridor_density: 0.5, //corridors per room
      symmetric_rooms: false, // exits must be in the center of a wall if true
      interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed 1 default
      max_interconnect_length: 20,//10
      room_count: 15
    },
    keys: 2
  },
  {
    dungeon: {
      size: [200, 200],
      //seed: 'abcd', //omit for generated seed
      rooms: {
        initial: {
          min_size: [3, 5],
          max_size: [3, 5],
          max_exits: 1,
          position: [0, 0] //OPTIONAL pos of initial room 
        },

        any: {
          min_size: [5, 5],
          max_size: [8, 8],
          max_exits: 4
        }
      },
      max_corridor_length: 15,//8
      min_corridor_length: 3,//2
      corridor_density: 0.5, //corridors per room
      symmetric_rooms: false, // exits must be in the center of a wall if true
      interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed 1 default
      max_interconnect_length: 20,//10
      room_count: 15
    },
    keys: 1
  }

] */
//OLD VERSION
let levels = [
  {},

  {
    type: 'dungeon',
    dungeon: {
      mazeType: 'fifo',
      roomAttempts: 100, //100
      roomMinSize: 2,//2 half 2 = 5
      roomMaxSize: 5, //5 half 5 = 10
      connectiveness: 1 / 40,
      halfHeight: 12,//12
      halftWidth: 32 //32
    },
    keys: 1
  },
  {
    type: 'cave',
    dungeon: { cols: 70, rows: 60 },
    keys: 1
  },
  {
    type: 'dungeon',
    dungeon: {
      mazeType: 'fifo',
      roomAttempts: 100, //100
      roomMinSize: 2,//2 half 2 = 5
      roomMaxSize: 5, //5 half 5 = 10
      connectiveness: 1 / 40,
      halfHeight: 12,//12
      halftWidth: 32 //32
    },
    keys: 1
  },
  {
    type: 'dungeon',
    dungeon: {
      mazeType: 'fifo',
      roomAttempts: 100, //100
      roomMinSize: 2,//2 half 2 = 5
      roomMaxSize: 5, //5 half 5 = 10
      connectiveness: 1 / 40,
      halfHeight: 12,//12
      halftWidth: 32 //32
    },
    keys: 1
  },
  {
    type: 'cave',
    dungeon: { cols: 70, rows: 60 },
    keys: 2
  },
  {
    type: 'dungeon',
    dungeon: { outerLimit: 3, cols: 80, rows: 50, maxRooms: 15, base: 6, extra: 10 },
    keys: 2
  },
  {
    type: 'cave',
    dungeon: { cols: 60, rows: 40 },
    keys: 2
  },


  {
    type: 'dungeon',
    dungeon: { outerLimit: 2, cols: 100, rows: 70, maxRooms: 35, base: 6, extra: 10 },
    keys: 1
  }

]
const BLANK = 0;
const ROOM_WALL = 1
const ROOM_FLOOR = 2;
const PATH_FLOOR = 3;
const PATH_WALL = 4;
const DOOR = 3