class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {

    gameData = JSON.parse(localStorage.getItem('PixelDungeonSave'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('PixelDungeonSave', JSON.stringify(defaultValues));
      gameData = defaultValues;
    }

    this.cameras.main.setBackgroundColor(0xf7eac6);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'PixeLike', 150).setOrigin(.5).setTint(0xc76210);

    var startNew = this.add.bitmapText(game.config.width / 2 - 50, 275, 'topaz', 'Play New', 50).setOrigin(0, .5).setTint(0x000000);
    startNew.setInteractive();
    startNew.on('pointerdown', this.clickHandler, this);

    var startSaved = this.add.bitmapText(game.config.width / 2 - 50, 475, 'topaz', 'Play Saved', 50).setOrigin(0, .5).setTint(0x000000);
    startSaved.setInteractive();
    startSaved.on('pointerdown', this.clickHandler2, this);


  }
  clickHandler() {
    localStorage.removeItem('PixelDungeonSave');
    localStorage.setItem('PixelDungeonSave', JSON.stringify(defaultValues));
    gameData = defaultValues;
    this.scene.start('playGame');


  }
  clickHandler2() {
    onLevel = gameData.playerData.onLevel
    this.scene.start('playGame');


  }
}