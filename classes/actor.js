class Actor extends Phaser.Physics.Arcade.Sprite {


  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene
    //this.getBody().setCollideWorldBounds(true);
  }

  getDamage(value) {
    this.scene.tweens.add({
      targets: this,
      alpha: .2,
      yoyo: true,
      duration: 100,
      onStart: () => {
        if (value) {
          this.hp = this.hp - value;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }

  getHPValue() {
    return this.hp;
  }

  checkFlip() {
    if (this.body.velocity.x < 0) {
      this.scaleX = -1;
    } else {
      this.scaleX = 1;
    }
  }

  getBody() {
    return this.body
  }
}
