class HealthBar {

  constructor(scene, x, y) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 1;

    this.draw();

    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return (this.value === 0);
  }

  draw() {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 14, 4);

    //  Health

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 1, this.y + 1, 12, 2);

    if (this.p < .3) {
      this.bar.fillStyle(0xff0000);
    }
    else {
      this.bar.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * 12);

    this.bar.fillRect(this.x + 1, this.y + 1, d, 2);
  }

}