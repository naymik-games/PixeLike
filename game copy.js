let game;

let dungeon
let cave
window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    render: {
      antialiasGL: false,
      pixelArt: true,
    },
    scene: [preloadGame, startGame, playGame, UIscene, mapScene, inventoryScene]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {
    onLevel++


    // Create a blank map
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: levels[onLevel].dungeon.cols,
      height: levels[onLevel].dungeon.rows
    });
    this.gridWidth = levels[onLevel].dungeon.cols
    this.gridHeight = levels[onLevel].dungeon.rows
    //this.gridSize = this.dungeon.width * this.dungeon.height;
    this.xOffset = 0
    this.yOffset = 0
    this.squareSize = 16



    // Load up a tileset, in this case, the tileset has 1px margin & 2px padding (last two arguments)
    const tileset = this.map.addTilesetImage("tiles", null, 16, 16, 0, 0);

    // Create empty layers. One for ground, one for stuff

    this.groundLayer = this.map.createBlankLayer("Ground", tileset); // Wall & floor
    this.stuffLayer = this.map.createBlankLayer("Stuff", tileset); // Chest, stairs, etc.

    //fill blank tiles
    this.groundLayer.fill(0);


    this.scene.launch('UIscene');

    //create groups
    this.enemies = this.physics.add.group()
    this.traps = this.physics.add.group()
    objects = this.physics.add.group({ classType: Collectables, runChildUpdate: false });

    breakables = this.physics.add.group({ classType: Smash, runChildUpdate: false })

    if (levels[onLevel].type == 'dungeon') {
      this.setUpDungeon()
    } else {
      this.setUpCave()
    }


    this.zoom = 4
    this.cameras.main.setBackgroundColor(0x222222);
    this.cameras.main.setZoom(this.zoom)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);


    //physics collisions
    this.physics.add.collider(this.player, this.stuffLayer);
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(
      this.player,
      this.enemies,
      (obj1, obj2) => {
        //console.log(obj2.power)
        obj1.getDamage(obj2.power);
      },
      undefined,
      this,
    );
    this.physics.add.collider(this.player, breakables);
    this.physics.add.collider(this.enemies, doorGroup);

    this.physics.add.collider(this.player, doorGroup, undefined,
      (obj1, obj2) => {
        return obj2.locked
      }, this);

    this.physics.add.collider(this.enemies, this.groundLayer);
    this.physics.add.overlap(this.player, objects, (obj1, obj2) => {
      obj2.action()

      obj2.destroy();
      this.cameras.main.flash();
    });
    this.physics.add.overlap(this.player, this.traps, (obj1, obj2) => {
      //obj2.action()
      //obj2.destroy();
      console.log('trap')
      if (obj2.anims.currentFrame == 0) {
        this.cameras.main.flash();
      }

    });



    //launch minimap scene
    this.UIscene = this.scene.get('UIscene');
    this.scene.launch('mapScene');


    //movment variables
    this.isRight = false;
    this.isLeft = false;
    this.isDown = false;
    this.isUp = false;

    // UI EVENT HANDLER ///////////////////////////
    // var UI = this.scene.get('UI');
    //  UI.events.on('vision', this.adjustVision, this);
    this.UIscene.events.on('zoom', this.adjustZoom, this);

    //  UI.events.on('action', this.action, this);
    //  UI.events.on('shoot', this.shoot, this);
    //  UI.events.on('hand', this.handAction, this);

    this.playable = true
    //this.UIscene.toast.showMessage('Hello world')

    ///help.setScrollFactor(0);
  }
  update() {
    //this.computeFOV()
    if (this.playable && levels[onLevel].type == 'dungeon') {
      var playerTileX = this.map.worldToTileX(this.player.x);
      var playerTileY = this.map.worldToTileY(this.player.y);
      var roomId = dungeon.inRoomID({ x: playerTileX, y: playerTileY })
      if (roomId > -1) {
        var roomText = roomId
      } else {
        var roomText = '--'
      }
      this.events.emit('room', roomText);

    }

    //var room = dungeon.getRoomAt(playerTileX, playerTileY);
    this.player.update()

    if (this.isRight) {
      this.player.body.velocity.x = this.player.playerData.speed;
      this.player.checkFlip();
      this.player.getBody().setOffset(12, 7);
      !this.player.anims.isPlaying && this.player.anims.play('run', true);
    } else if (this.isLeft) {
      this.player.body.velocity.x = -this.player.playerData.speed;
      this.player.checkFlip();
      // this.player.getBody().setOffset(48, 15);

      this.player.getBody().setOffset(21, 7);
      !this.player.anims.isPlaying && this.player.anims.play('run', true);
    } else if (this.isUp) {
      this.player.body.velocity.y = -this.player.playerData.speed;
      !this.player.anims.isPlaying && this.player.anims.play('run', true);
    } else if (this.isDown) {
      this.player.body.velocity.y = this.player.playerData.speed;
      !this.player.anims.isPlaying && this.player.anims.play('run', true);

    } else {
      this.stop();

    }
  }
  stop() {
    this.player.body.setVelocity(0);
    var endCol = Math.floor(this.player.x / 16);
    var endRow = Math.floor(this.player.y / 16);


    var x = endCol * this.squareSize + this.squareSize / 2;
    var y = endRow * this.squareSize + this.squareSize / 2;
    this.player.setPosition(x, y)


  }

  setUpDungeon() {
    //let dungeon = new Dungeon(levels[onLevel].dungeon);
    dungeon = new Dungeon(levels[onLevel].dungeon);
    dungeon.resetMap();
    dungeon.generateMapRooms();

    //console.log(dungeon.map)

    console.log(dungeon.rooms)
    // console.log(dungeon.corridoors)
    // console.log(dungeon.doors)
    //let mapData = dungeon.map

    //copy 2d tile map 
    this.tileData = JSON.parse(JSON.stringify(dungeon.map));
    //console.log(this.tileData)
    //console.log(this.dungeon.rooms)

    ////////////////////////////////////////////////////////
    //MAP TILES
    /////////////////////////////////////////////////////////
    const tiles = autotile(this.tileData);
    //console.log(tiles)
    for (var y1 = 0; y1 < this.tileData.length; y1++) {
      for (var x1 = 0; x1 < this.tileData[0].length; x1++) {
        //this.tileData[y][x]
        if (tiles[y1][x1] == 46) {
          this.groundLayer.weightedRandomize([
            { index: 46, weight: 9 },              // 9/10 times, use index 11
            { index: [64, 65, 66, 67], weight: 1 }      // 1/10 times, randomly pick 7, 8 or 26
          ], x1, y1);
        } else if (tiles[y1][x1] == 42) {
          this.groundLayer.weightedRandomize([
            { index: 42, weight: 9 },              // 9/10 times, use index 11
            { index: [60, 61, 62, 63, 71, 72, 73], weight: 1 }      // 1/10 times, randomly pick 7, 8 or 26
          ], x1, y1);
        } else {
          this.groundLayer.putTileAt(tiles[y1][x1], x1, y1);
        }

      }
    }
    //END MAP TILES

    //////////////////////////////
    // DOORS
    //////////////////////////////
    doorGroup = this.physics.add.group({ classType: Door, runChildUpdate: false });
    /* dungeon.doors.forEach(door => {
      //this.stuffLayer.putTileAt(56, door.x, door.y);
      var doorImg = doorGroup.get();
      if (doorImg) {
        //var pos = this.getXY(doors[i].x, doors[i].y)
        var pos = this.getXY(door.x, door.y)
        //var pos = this.map.tileToWorldXY(door.x, door.y)
        doorImg.setType(doorTypes[0])

        doorImg.setActive(true);
        doorImg.setVisible(true);
        doorImg.launch(pos.x, pos.y);
        console.log('door added')
      }

    }) */
    dungeon.rooms.forEach(room => {
      room.doors.forEach(door => {
        var doorImg = doorGroup.get();
        if (doorImg) {
          //var pos = this.getXY(doors[i].x, doors[i].y)
          var pos = this.getXY(door.x, door.y)
          //var pos = this.map.tileToWorldXY(door.x, door.y)
          doorImg.setType(doorTypes[0])
          if (room.doors.length == 1) {
            doorImg.locked = true
          }
          doorImg.setActive(true);
          doorImg.setVisible(true);
          doorImg.launch(pos.x, pos.y);
          console.log('door added')
        }
      })
    })
    //END DOORS


    // console.log(test.getDoors())
    //fill stuff layer with blank tiles
    this.stuffLayer.fill(0);
    //copy rooms
    const rooms = dungeon.rooms.slice();
    const paths = dungeon.corridoors.slice()
    console.log(rooms)
    //pull out start room
    var sid = this.getStartRoom(rooms) //gets first room with more than one door
    const sr = rooms.splice(sid, 1)
    const startRoom = sr[0]
    //const startRoom = rooms.shift();  gets the first room
    this.startRoomID = startRoom.id

    //pull out end room
    const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
    //all other rooms
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice();
    console.log(otherRooms)
    // Place the stairs in end room
    this.stuffLayer.putTileAt(53, endRoom.center.x, endRoom.center.y);



    //make stairs interactive
    this.stuffLayer.setTileIndexCallback(53, () => {
      if (this.player.canExit) {
        this.playable = false
        this.stuffLayer.setTileIndexCallback(53, null);
        this.hasPlayerReachedStairs = true;
        this.player.playerData.onLevel = onLevel
        console.log(this.player.playerData)
        this.saveGame()
        this.player.freeze();
        this.scene.stop('UI')
        const cam = this.cameras.main;
        cam.fade(500, 0, 0, 0);
        cam.once("camerafadeoutcomplete", () => {
          // this.player.destroy();


          this.scene.start();
        });
      }
    });
    //set collision tiles for the layers
    //this.groundLayer.setCollision([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 35, 50, 51, 52, 53]);
    this.groundLayer.setCollisionByExclusion([46, 64, 65, 66, 67]);
    this.stuffLayer.setCollisionByExclusion([78]);





    //add player to start room
    //console.log(startRoom)
    const x = this.map.tileToWorldX(startRoom.center.x);
    const y = this.map.tileToWorldY(startRoom.center.y);
    this.player = new Player(this, x, y);



    //place items by  by count
    //console.log(this.tileData)
    //keys
    const keyRooms = otherRooms.slice();
    //console.log(keyRooms)
    for (var i = 0; i < levels[onLevel].keys; i++) {
      let keyRoom = Phaser.Utils.Array.RemoveRandomElement(keyRooms);
      // console.log(keyRoom)
      var coord = this.getRandomSpotRoom(keyRoom)
      this.placeObject(5, coord)
    }
    //map
    var coord2 = this.getRandomSpotRoom(otherRooms[Phaser.Math.Between(0, otherRooms.length - 1)])

    this.placeObject(3, coord2)
    //randomly fill rooms
    otherRooms.forEach(room => {
      var type = Phaser.Math.RND.pick(multiIndexes)
      var coord3 = this.getRandomSpotRoom(room)
      this.placeObject(type, coord3)
      let rand = Math.random();
      if (rand <= 0.75) {
        // 50% chance of a pot anywhere in the room... except don't block a door!
        //book


        var coord4 = this.getRandomSpotRoom(room)
        this.placeEnemyAt(coord4.x, coord4.y)
        var coord5 = this.getRandomSpotRoom(room)
        this.placeTrapAt(coord5.x, coord5.y)
        /*         var x = Phaser.Math.Between(room.tl.x + 2, room.tr.x - 2);
                var y = Phaser.Math.Between(room.tl.y + 2, room.bl.y - 2);
                this.placeEnemyAt(x, y) */
      }
      rand = Math.random();

      var ranAmount = Phaser.Math.Between(0, 4)
      for (var b = 0; b < ranAmount; b++) {
        var smashType = Phaser.Math.Between(0, 4)
        var coord = this.getRandomSpotRoom(room)
        this.placeBreakable(smashType, coord)
      }



    });

    //populate corridoors
    for (var i = 0; i < 5; i++) {
      let path = Phaser.Utils.Array.RemoveRandomElement(paths);
      if (Math.random > .5) {
        this.placeRandomAt(path.x, path.y)
      } else {
        this.placeEnemyAt(path.x, path.y)
      }
    }
    /*    this.visionLayer = this.map.createBlankLayer("Vision", tileset); // visibility
       this.visionLayer.fill(78).setDepth(100);
   
   
       this.fov = new Mrpas(60, 40, (x, y) => {
         const tile = this.groundLayer.getTileAt(x, y)
         return tile && !tile.collides
       }) */
    // console.log(this.tileData)

  }


  setUpCave() {
    var rand = Phaser.Math.Between(0, 100)
    if (rand < 1) {
      cave = new Cave(levels[onLevel].dungeon.cols, levels[onLevel].dungeon.rows);
      cave.generateMap();
      console.log('Cave 1')
      console.log(cave.map)

      this.tileData = JSON.parse(JSON.stringify(cave.map));
    } else {
      cave = new CaveAlt(levels[onLevel].dungeon.cols, levels[onLevel].dungeon.rows)
      var map = cave.generateBoard();
      console.log('Cave Alt')
      console.log(map)
      this.tileData = JSON.parse(JSON.stringify(map));
    }





    ////////////////////////////////////////////////////////
    //MAP TILES
    /////////////////////////////////////////////////////////
    var tiles = this.tileData
    //console.log(tiles)
    for (var y1 = 0; y1 < this.tileData.length; y1++) {
      for (var x1 = 0; x1 < this.tileData[0].length; x1++) {
        //this.tileData[y][x]
        if (tiles[y1][x1] == 2) {
          this.groundLayer.weightedRandomize([
            { index: 69, weight: 10 },              // 9/10 times, use index 11
            // { index: [64, 65, 66, 67], weight: 1 }      // 1/10 times, randomly pick 7, 8 or 26
          ], x1, y1);
        } else if (tiles[y1][x1] == 0) {
          this.groundLayer.weightedRandomize([
            { index: 47, weight: 10 },              // 9/10 times, use index 11
            // { index: [60, 61, 62, 63, 71, 72, 73], weight: 1 }      // 1/10 times, randomly pick 7, 8 or 26
          ], x1, y1);
        } else {
          this.groundLayer.putTileAt(tiles[y1][x1], x1, y1);
        }

      }
    }
    this.groundLayer.setCollisionByExclusion([69]);
    //END MAP TILES
    //add player to start room

    let coord = this.getRandomSpotCave()
    const x = this.map.tileToWorldX(coord.x);
    const y = this.map.tileToWorldY(coord.y);

    this.player = new Player(this, x, y);

    //add key
    var coord1 = this.getRandomSpotCave()
    this.placeObject(5, coord1)

    //add map
    var coord2 = this.getRandomSpotCave()
    this.placeObject(3, coord2)
    //breakables
    for (var i = 0; i < 20; i++) {
      let coord = this.getRandomSpotCave()
      var smashType = Phaser.Math.Between(0, 4)

      this.placeBreakable(smashType, coord)
    }
    //extra objext
    for (var i = 0; i < 10; i++) {
      let coord = this.getRandomSpotCave()

      var pos = this.getXY(coord.x, coord.y)
      this.placeRandomAt(pos.x, pos.y, multiIndexes)
    }

    for (var i = 0; i < 25; i++) {
      let coord = this.getRandomSpotCave()

      this.placeEnemyAt(coord.x, coord.y)
    }
  }

  showMapButton() {
    this.events.emit('mapButton');
  }
  clearRoom(id) {
    var room = dungeon.rooms[id]
    for (var y = room.start.y; y <= room.end.y; ++y) {
      for (var x = room.start.x; x <= room.end.x; ++x) {
        var tile = this.visionLayer.getTileAt(x, y)
        tile.setAlpha(0)
      }
    }
  }
  addToInventory(obID) {
    this.player.playerData.inventory.push(obID)

  }
  //place random object from choice of object at given coordinate
  placeRandomAt(x, y, rewards) {
    var object = objects.get();
    if (object) {
      var pos = this.getXY(x, y)
      var thing = rewards[Phaser.Math.Between(0, rewards.length - 1)]
      object.setType(objectTypes[thing])

      object.setActive(true);
      object.setVisible(true);
      object.launch(x, y);
      var cr = this.getCR(x, y)
      //this.tileData[cr.row][cr.y] = (10 + 6)
    }
  }

  //place given object at given location
  placeObject(ob, coord) {


    var x = coord.x;
    var y = coord.y;

    var object = objects.get();
    if (object) {

      var pos = this.getXY(x, y)
      object.setType(objectTypes[ob])

      object.setActive(true);
      object.setVisible(true);
      object.launch(pos.x, pos.y);
      this.tileData[y][x] = (10 + ob)

    }

  }
  //place given breakable at given location
  placeBreakable(ob, coord) {

    var x = coord.x
    var y = coord.y

    var breaker = breakables.get();
    if (breaker) {
      var pos = this.getXY(x, y)
      breaker.setType(smashTypes[ob], this.player)

      breaker.setActive(true);
      breaker.setVisible(true);
      breaker.launch(pos.x, pos.y);
      this.tileData[y][x] = (50 + ob)

    }

  }
  placeEnemyAt(col, row) {
    var pos = this.getXY(col, row)
    var enemy = new Enemy(this, pos.x, pos.y, 'enemies', this.player, 0).setScale(1.5)
    var ranEn = Phaser.Math.Between(0, 2)
    enemy.setType(this, ranEn)
    this.enemies.add(enemy)
  }
  placeTrapAt(col, row) {
    var pos = this.getXY(col, row)
    var trap = new Trap(this, pos.x, pos.y, 'traps', this.player, 0)
    // var ranEn = Phaser.Math.Between(0, 2)
    trap.setType(this, 0)
    this.traps.add(trap)
  }
  //get random location in a ro0m
  getRandomSpotRoom(room) {
    var done = false
    while (!done) {
      console.log(room)
      var x = Phaser.Math.Between(room.tl.x + 1, room.tr.x - 1);
      var y = Phaser.Math.Between(room.tr.y + 1, room.br.y - 1);
      if (this.tileData[y][x] == ROOM_FLOOR) {
        done = true
        return { x: x, y: y }
      }
    }
  }
  getRandomSpotCave() {
    var done = false
    while (!done) {

      var x = Phaser.Math.Between(0, levels[onLevel].dungeon.cols)
      var y = Phaser.Math.Between(0, levels[onLevel].dungeon.rows);
      if (this.tileData[y][x] == ROOM_FLOOR) {
        done = true
        return { x: x, y: y }
      }
    }
  }
  getStartRoom(rooms) {
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (room.doors.length > 1) {
        return room.id
      }
    }
  }
  adjustZoom() {
    this.zoom += .5;
    if (this.zoom > 7) {
      this.zoom = 1

    }
    this.cameras.main.setZoom(this.zoom)
    this.cameras.main.centerOn(this.player.x, this.player.y)
  }
  placeTreasure(board, color, treasureHiddenLimit) {

    for (var x = 0; x < 100; x++) {
      for (var y = 0; y < 100; y++) {
        if (board[x][y]) {
          var nbs = countAliveNeighbours(board, x, y);
          if (nbs == 1) {
            ctx.fillRect(x * 10, y * 10, 10, 10);
            treasureHiddenLimit--;
            if (treasureHiddenLimit === 0)
              return;
          }
        }
      }
    }
  }


  //analize neighbour cells
  countAliveNeighbours(board, i, j) {
    var count = 0;

    for (var m = i - 1; m <= i + 1; m++) {
      for (var n = j - 1; n <= j + 1; n++) {
        if (m === i && n === j) {
          continue;
        }

        var row = m;
        var col = n;
        //we looking out of the array's bounds
        if (m >= board.length || m < 0)
          continue;
        //we looking out of the array's bounds
        else if (n >= board[0].length || n < 0)
          continue;

        else if (board[row][col] > 0) {
          count++;
        }
      }
    }
    return count;
  }

  //HELPERS //////////////////////////////////
  getCR(pixelX, pixelY) {
    var endCol = Math.floor(pixelX / 16);
    var endRow = Math.floor(pixelY / 16);
    return { col: endCol, row: endRow }
  }
  getXY(col, row) {
    var x = col * this.squareSize + this.squareSize / 2;
    var y = row * this.squareSize + this.squareSize / 2;
    return { x: x, y: y }
  }
  updateMini(cR) {
    this.events.emit('updateMini', cR)
  }
  addScore() {
    this.events.emit('score');
  }
  saveGame() {
    gameData = {}
    gameData.playerData = this.player.playerData
    localStorage.setItem('PixelDungeonSave', JSON.stringify(gameData));
  }
  computeFOV() {
    if (!this.fov || !this.map || !this.visionLayer || !this.player) {
      return
    }

    // get camera view bounds
    const camera = this.cameras.main
    const bounds = new Phaser.Geom.Rectangle(
      this.map.worldToTileX(camera.worldView.x) - 1,
      this.map.worldToTileY(camera.worldView.y) - 1,
      this.map.worldToTileX(camera.worldView.width) + 2,
      this.map.worldToTileX(camera.worldView.height) + 3
    )

    // set all tiles within camera view to invisible
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        if (y < 0 || y >= 40 || x < 0 || x >= 60) {
          continue
        }

        const tile = this.visionLayer.getTileAt(x, y)
        if (!tile) {
          continue
        }

        tile.alpha = 1
      }
    }

    // calculate fov here...
    // get player's position
    const px = this.map.worldToTileX(this.player.x)
    const py = this.map.worldToTileY(this.player.y)

    // compute fov from player's position
    this.fov.compute(
      px,
      py,
      13,
      (x, y) => {
        const tile = this.visionLayer.getTileAt(x, y)
        if (!tile) {
          return false
        }
        return tile.alpha = 1
      },
      (x, y) => {
        const tile = this.visionLayer.getTileAt(x, y)
        if (!tile) {
          return
        }
        tile.alpha = 0
      }
    )






  }
}
