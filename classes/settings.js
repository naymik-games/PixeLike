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
    hp: 20,
    hpMax: 20,
    gold: 0,
    power: 1,
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
let levels = [
  {},

  {
    dungeon: { outerLimit: 3, cols: 80, rows: 50, maxRooms: 15, base: 6, extra: 10 },
    keys: 1
  },
  {
    dungeon: { outerLimit: 3, cols: 80, rows: 50, maxRooms: 15, base: 6, extra: 10 },
    keys: 1
  },
  {
    dungeon: {

      colums: 101,
      rows: 101,
      roomTwistiness: 0.2,
      fillFraction: 0.6,
      connectedness: 2,
      monsterFrequency: .5,
      numExtraPU: 4,
      roomOpts: {
        maxRows: 16,
        minRows: 6,
        maxCols: 16,
        minCols: 6,
        minSpacing: 2,
      }
    },
    keys: 1
  }

]

const BLANK = 0;
const ROOM_WALL = 1
const ROOM_FLOOR = 2;
const PATH_FLOOR = 3;
const PATH_WALL = 4;
const DOOR = 5