class inventoryScene extends Phaser.Scene {
  constructor() {
    super("inventoryScene");
  }
  preload() {


  }
  create() {
    this.Main = this.scene.get('playGame');
    this.backBack1 = this.add.image(game.config.width / 2, game.config.height / 2, 'inventory_bg')

    var exit = this.add.image(game.config.width / 2, 800, 'blank').setOrigin(.5).setTint(0xcccccc).setInteractive();
    exit.displayWidth = 100;
    exit.displayHeight = 100;
    var count = 0
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 4; j++) {
        var tile = this.add.image(150 + j * 120, 500 + i * 120, 'inventory_item').setOrigin(.5);
        tile.displayWidth = 100;
        tile.displayHeight = 100;
        if (this.Main.player.playerData.inventory[count]) {
          var obID = this.Main.player.playerData.inventory[count]
          var ob = this.add.image(tile.x, tile.y, 'tiles', objectTypes[obID].frame).setScale(4).setInteractive()
          ob.item = obID
          ob.on('pointerup', this.selectItem.bind(this, ob))
        }
        count++
      }
    }

    //var exit = this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 475, 'atari', 'EXIT', 40).setOrigin(.5).setTint(0x3e5e71);
    exit.setInteractive();
    exit.on('pointerdown', function () {

      // localStorage.setItem('ringTotal', JSON.stringify(this.ringTotal));
      this.scene.stop();

      this.scene.resume('playGame');
      this.scene.resume('UIscene');
      this.Main.playable = true
    }, this);
    this.selected = this.add.image(-50, -50, 'inventory_item_selected').setOrigin(.5)
  }
  selectItem(t) {
    console.log(t.item)
    this.selected.setPosition(t.x, t.y)
  }

}
