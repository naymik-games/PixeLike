class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }

    /*  this.load.spritesheet("tiles", "assets/sprites/tiles_better.png", {
       frameWidth: 32,
       frameHeight: 32,
       //margin: 2,
       //spacing:2
 
     }); */
    this.load.spritesheet("d_tiles", "assets/sprites/dungeon_tiles_dark.png", {
      frameWidth: 16,
      frameHeight: 16,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("c_tiles", "assets/sprites/cave_tilesNew.png", {
      frameWidth: 16,
      frameHeight: 16,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("tiles", "assets/sprites/tileset16x16_auto.png", {
      frameWidth: 16,
      frameHeight: 16,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("knight", "assets/spritesheets/a-knight.png", {
      frameWidth: 64,
      frameHeight: 64,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("hero1", "assets/spritesheets/hero/a-hero_1.png", {
      frameWidth: 36,
      frameHeight: 24,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("hero2", "assets/spritesheets/hero/a-hero_2_.png", {
      frameWidth: 36,
      frameHeight: 24,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("hero3", "assets/spritesheets/hero/a-hero_3_.png", {
      frameWidth: 36,
      frameHeight: 24,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("enemies", "assets/spritesheets/a-enemies.png", {
      frameWidth: 32,
      frameHeight: 32,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("traps", "assets/spritesheets/a-traps.png", {
      frameWidth: 16,
      frameHeight: 16,
      //margin: 2,
      //spacing:2

    });
    this.load.spritesheet("particle_color", "assets/sprites/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });




    /*   this.load.spritesheet('objects_small', 'assets/sprites/objects_small.png', {
        frameWidth: 9,
        frameHeight: 9,
      }); */
    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/topaz.png', 'assets/fonts/topaz.xml');
    this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("rover", "assets/sprites/rover.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    //this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('cross', 'assets/controls/dpad.png');
    this.load.image('inventory_bg', 'assets/sprites/inventory_bg.png');
    this.load.image('inventory_item', 'assets/sprites/inventory_item.png');
    this.load.image('inventory_item_selected', 'assets/sprites/inventory_item_selected.png');
    this.load.image('player_ui', 'assets/sprites/player_ui.png');
    this.load.image('aButton', 'assets/controls/a_button.png')
    //this.load.image('PhoneControl2', 'assets/controls/phoneControl.png');
    // this.load.image('PhoneControl', 'assets/controls/phoneControlThumb.png');
    this.load.image('nav_arrow', 'assets/controls/nav_arrow.png');
    this.load.spritesheet("buttons", "assets/controls/button_icons.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("tiles_mini", "assets/sprites/tiles_mini.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








