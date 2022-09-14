class UIscene extends Phaser.Scene {

  constructor() {

    super("UIscene");
  }
  preload() {



  }
  create() {
    let mapScene = this.scene.get('mapScene');
    this.Main = this.scene.get('playGame');
    /*  this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x000000).setAlpha(.7);
     this.header.displayWidth = 870;
     this.header.displayHeight = 200;
  */


    /*   this.skillBG = this.add.image(game.config.width / 2, 200, 'blank').setOrigin(.5, 0).setTint(0xcbf7ff);
      this.skillBG.displayWidth = 900;
      this.skillBG.displayHeight = 40;
  
  
      this.currentSkillBG = this.add.image(10, 200, 'blank').setOrigin(0).setTint(0x3e5e71);
      this.currentSkillBG.displayWidth = 40;
      this.currentSkillBG.displayHeight = 40;
  
  
      this.nextSkillBG = this.add.image(game.config.width - 10, 200, 'blank').setOrigin(1, 0).setTint(0x3e5e71);
      this.nextSkillBG.displayWidth = 40;
      this.nextSkillBG.displayHeight = 40;
   */

    this.inventoryButton = this.add.image(game.config.width - 50, 100, 'blank').setOrigin(.5).setTint(0x3e5e71).setInteractive();
    this.inventoryButton.displayWidth = 100;
    this.inventoryButton.displayHeight = 100;
    this.inventoryButton.on('pointerdown', function () {
      this.Main.playable = false
      this.scene.pause('playGame')
      this.scene.pause()

      this.scene.launch('inventoryScene')
    }, this)


    this.uiTest = this.add.image(0, 0, 'player_ui').setOrigin(0).setAlpha(1).setScale(1.5)

    this.levelText = this.add.bitmapText(155, 50, 'topaz', onLevel, 35).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1)
    console.log(this.Main.player.playerData)
    this.skillText = this.add.bitmapText(18, 145, 'topaz', 'SKILL ' + this.Main.player.playerData.skillLevel, 35).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1)
    this.progressMeter = this.add.image(18, 185, 'blank').setOrigin(0, .5).setTint(0xE3E2BF);
    this.progressMeter.displayWidth = 250 * (this.Main.player.playerData.skillProgress / this.Main.player.playerData.skillGoal)
    this.progressMeter.displayHeight = 20;




    this.healthText = this.add.bitmapText(400, 35, 'topaz', this.Main.player.playerData.hp, 50).setOrigin(1, .5).setTint(0xcbf7ff).setAlpha(1);
    //this.healthIcon = this.add.image(15, 35, 'tiles', 115).setScale(4).setOrigin(0, .5)

    this.goldText = this.add.bitmapText(400, 105, 'topaz', this.Main.player.playerData.gold, 50).setOrigin(1, .5).setTint(0xcbf7ff).setAlpha(1);
    // this.goldIcon = this.add.image(this.goldText.x, 35, 'tiles', 86).setScale(4).setOrigin(0, .5)

    this.magicText = this.add.bitmapText(400, 175, 'topaz', this.Main.player.playerData.magic, 50).setOrigin(1, .5).setTint(0xcbf7ff).setAlpha(1);
    //this.magicIcon = this.add.image(this.magicText.x, 35, 'tiles', 97).setScale(4).setOrigin(0, .5)

    this.zoomButton = this.add.image(700, 270, 'buttons', 4).setOrigin(.5, 0).setInteractive()
    this.zoomButton.on('pointerdown', function () {
      this.events.emit('zoom');
    }, this);
    this.mapButton = this.add.image(575, -270, 'buttons', 3).setOrigin(.5, 0).setInteractive()
    this.mapButton.on('pointerdown', function () {
      mapScene.showMap()
    }, this);




    this.actionButton = this.add.image(725, 1490, 'buttons', 0).setOrigin(.5, 0).setInteractive()
    this.actionButton.on('pointerdown', function () {
      this.events.emit('action');
    }, this);

    this.shootButton = this.add.image(175, 1490, 'buttons', 1).setOrigin(.5, 0).setInteractive()
    this.shootButton.on('pointerdown', function () {
      //this.events.emit('shoot');
      this.Main.player.anims.play('cast', true)
    }, this);



    this.helpText = this.add.text(200, 220, '--', {
      fontSize: '48px',
      padding: { x: 10, y: 10 },
      backgroundColor: '#ffffff',
      fill: '#000000'
    });

    /*     this.handButton = this.add.image(this.cross.x, this.cross.y, 'buttons', 1).setOrigin(.5).setInteractive()
        this.handButton.on('pointerdown', function () {
          // this.events.emit('hand');
          this.Main.player.anims.play('attack', true);
          this.Main.game.events.emit(EVENTS_NAME.attack);
          this.Main.game.events.emit(EVENTS_NAME.smash);
        }, this); */



    this.Main.events.on('room', function (roomText) {
      this.helpText.setText(roomText)
    }, this)

    this.Main.events.on('mapButton', function (roomText) {
      this.tweens.add({
        targets: this.mapButton,
        y: 270,
        duration: 300
      })
    }, this)
    this.Main.events.on('score', function () {
      this.healthText.setText(this.Main.player.playerData.hp)
      this.goldText.setText(this.Main.player.playerData.gold)
      this.magicText.setText(this.Main.player.playerData.magic)
      // console.log(this.Main.player.playerData.skillProgress)
      this.progressMeter.displayWidth = 250 * (this.Main.player.playerData.skillProgress / this.Main.player.playerData.skillGoal);
    }, this);

    this.dpad = new GamePad(this, this.Main)
    //this.joystick = new TouchControl(this, this.Main)


  }

  update() {

  }



}

////////////////////////////////////////////////////////////////////////////////////////
class mapScene extends Phaser.Scene {

  constructor() {

    super("mapScene");
  }
  preload() {



  }
  create() {
    this.main = this.scene.get('playGame');
    this.main.events.on('updateMini', function (cR) {
      //console.log(cR)
      this.miniMapTiles[cR.row][cR.col].setFrame(2)
    }, this);


    // console.log(this.main.tileData[15])

    this.miniMapTiles = []
    var playerX = this.main.player.x
    var playerY = this.main.player.y
    var playerCR = this.main.getCR(playerX, playerY)
    console.log(playerCR)
    this.miniContainer = this.add.container()
    if (this.main.gridWidth >= this.main.gridHeight) {
      this.tileSize = 900 / this.main.gridWidth
    } else {
      this.tileSize = 1240 / this.main.gridHeight
    }

    for (var y = 0; y < this.main.tileData.length; y++) {
      var tempArray = []
      for (var x = 0; x < this.main.tileData[0].length; x++) {
        var tileXPos = x * (this.tileSize + 0) + this.tileSize / 2;
        var tileYPos = 400 + y * (this.tileSize + 0) + this.tileSize / 2;
        if (this.main.tileData[y][x] == 4) {
          var fr = 1
        } else if (this.main.tileData[y][x] == 3) {
          var fr = 3
        } else if (this.main.tileData[y][x] == 2) {
          var fr = 2
        } else if (this.main.tileData[y][x] == 1) {
          var fr = 1
        } else if (this.main.tileData[y][x] == 0) {
          var fr = 0
        } else {
          var fr = 2
        }
        var tile = this.add.image(tileXPos, tileYPos, 'tiles_mini', fr)
        tile.displayWidth = this.tileSize
        tile.displayHeight = this.tileSize
        tempArray.push(tile)
        this.miniContainer.add(tile)
      }
      this.miniMapTiles.push(tempArray)
    }
    //this.miniMapTiles[18][9].setAlpha(.2)
    var tileXPos = playerCR.col * (this.tileSize + 0) + this.tileSize / 2;

    var tileYPos = 400 + playerCR.row * (this.tileSize + 0) + this.tileSize / 2;

    this.miniPlayer = this.add.image(tileXPos, tileYPos, 'blank').setTint(0x00ff00);
    this.miniPlayer.displayWidth = this.tileSize * 2;
    this.miniPlayer.displayHeight = this.tileSize * 2
    /*this.miniTween = this.tweens.add({
      targets: this.miniPlayer,
      alpha: 0,
      duration: 800,
      yoyo: true
    })*/
    this.miniContainer.add(this.miniPlayer)
    this.miniContainer.setVisible(false)
  }
  showMap() {
    console.log('show mini map')
    if (this.miniContainer.visible) {
      this.miniContainer.setVisible(false)
    } else {
      var playerX = this.main.player.x
      var playerY = this.main.player.y
      var playerCR = this.main.getCR(playerX, playerY)
      var tileXPos = playerCR.col * (this.tileSize + 0) + this.tileSize / 2;
      var tileYPos = 400 + playerCR.row * (this.tileSize + 0) + this.tileSize / 2;

      this.miniPlayer.setPosition(tileXPos, tileYPos)
      this.miniContainer.setVisible(true)
    }

  }

}