class Player extends Actor {


  constructor(scene, x, y) {
    super(scene, x, y, heroKey);
    // super(scene, x, y, 'hobbit');
    this.scene = scene
    this.tick = 0
    this.playerData = gameData.playerData
    this.alive = true
    this.immune = false;

    this.canExit = false
    this.hpBar = new HealthBar(scene, this.x, this.y - this.height * 0.4);
    //this.hpValue = scene.add.text(x, y, this.getHPValue(), { fontFamily: 'Arial', fontSize: 14, color: '#fff', stroke: '#000', strokeThickness: 4, }).setOrigin(0.8, 0.5);
    this.setOrigin(.5, .6)
    this.setDepth(1)
    // PHYSICS
    this.getBody().setSize(9, 15, true);
    this.getBody().setOffset(12, 7);
    //this.getBody().setSize(11, 17, true);
    //this.getBody().setOffset(7, 0);

    this.setScale(1)
    // this.setScale(2)
    // ANIMATIONS
    this.initAnimations();

    this.on('destroy', () => {
      // this.keySpace.removeAllListeners();
    });

  }

  update(time, delta) {

    //this.hpBar.bar.setPosition(this.x - 8, this.y - 25);
    this.hpBar.x = this.x - 8
    this.hpBar.y = this.y - this.height * 0.7
    this.hpBar.draw()
    //this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    //this.hpValue.setOrigin(0.8, 0.5);
  }
  freeze() {
    this.body.moves = false;
  }

  initAnimations() {
    this.scene.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers(heroKey, { frames: [0, 1, 2, 3, 4, 5] }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers(heroKey, { frames: [18, 19, 20, 21] }),
      frameRate: 16,
    });
    this.scene.anims.create({
      key: 'cast',
      frames: this.anims.generateFrameNumbers(heroKey, { frames: [42, 43, 44, 45, 46, 47] }),
      frameRate: 6,
    });
    this.scene.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('hero1', { frames: [36, 37, 38, 39, 40] }),
      frameRate: 8,
    });

    // console.log(this.scene.anims)
  }
  skillPop(amount) {
    var help = this.scene.add.text(this.x, this.y - this.height * .6, '+' + amount, {
      fontSize: '16px',
      // padding: { x: 10, y: 10 },
      //backgroundColor: '#00ff00',
      fill: '#00ff00'
    });
    this.scene.tweens.add({
      targets: help,
      y: '-=50',
      duration: 500,
      onComplete: function () {
        help.destroy()
      }
    })
  }
  getDamage(value) {
    if (!this.immune && this.alive) {
      this.immune = true;
      this.playerData.hp -= value
      this.hpBar.p = this.playerData.hp / this.playerData.hpMax
      // this.hpValue.setText(this.hp.toString());
      this.scene.addScore()
      this.setAlpha(.5)
      this.scene.time.delayedCall(this.playerData.immuneTime, () => {
        this.immune = false
        this.setAlpha(1)
      });

      if (this.playerData.hp <= 0) {
        this.setAlpha(1)
        this.anims.play('die', true);
        this.alive = false
        this.scene.die()
      }
    }

  }
}