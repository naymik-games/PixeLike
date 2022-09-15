class inventoryScene extends Phaser.Scene {
  constructor() {
    super("inventoryScene");
  }
  preload() {


  }
  create() {
    this.Main = this.scene.get('playGame');
    this.backBack1 = this.add.image(game.config.width / 2, game.config.height / 2, 'inventory_bg')

    var exit = this.add.image(750, 400, 'blank').setOrigin(.5).setTint(0xcccccc).setInteractive();
    exit.displayWidth = 75;
    exit.displayHeight = 75;
    var count = 0
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var tile = this.add.image(225 + j * 145, 500 + i * 145, 'inventory_item').setOrigin(.5);
        tile.displayWidth = 125;
        tile.displayHeight = 125;
        if (this.Main.player.playerData.inventory[count]) {
          var obID = this.Main.player.playerData.inventory[count]
          var ob = this.add.image(tile.x, tile.y, 'tiles', objectTypes[obID].frame).setScale(5).setInteractive()
          ob.item = obID
          ob.on('pointerup', this.selectItem.bind(this, ob))
        }
        count++
      }
    }
    let nameStyle = {
      fontSize: '85px',
      fill: '##483B3A',
      fontFamily: 'CustomFont'
    }
    this.selectedText = this.add.text(150, 1075, ' ', nameStyle).setOrigin(0, .5);

    var useButton = new Button(this, 225, 1200, 'Use', buttonStyle1, this.use, true)
    var equipButton = new Button(this, 425, 1200, 'Equip', buttonStyle1, this.equip, true)
    var deleteButton = new Button(this, 675, 1200, 'Delete', buttonStyle1, this.delete, true)
    // this.useText = this.add.bitmapText(250, 1200, 'topaz', 'USE', 55).setOrigin(.5, .5).setTint(0x000000).setAlpha(1)
    //this.useText = this.add.bitmapText(600, 1200, 'topaz', 'EQUIP', 55).setOrigin(.5, .5).setTint(0x000000).setAlpha(1)
    //var exit = this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 475, 'atari', 'EXIT', 40).setOrigin(.5).setTint(0x3e5e71);
    exit.setInteractive();
    exit.on('pointerdown', function () {

      // localStorage.setItem('ringTotal', JSON.stringify(this.ringTotal));
      this.scene.stop();

      this.scene.resume('playGame');
      this.scene.resume('UIscene');
      this.Main.playable = true
    }, this);
    this.selected = this.add.image(-50, -50, 'inventory_item_selected').setOrigin(.5).setScale(1.25)
  }
  selectItem(t) {
    console.log(t.item)
    this.selectedText.setText(objectTypes[t.item].name)
    this.selected.setPosition(t.x, t.y)
  }
  use() {

  }
  equip() {

  }
  delete() {

  }
}
