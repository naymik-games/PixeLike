var Smash = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Smash(scene) {

      Phaser.GameObjects.Image.call(this, scene, 450, 0, 'tiles', 0);
      this.setScale(1)
      this.setAlpha(1)
      //this.spawn = spawnPoints[spawnAlt]

      this.scene = scene

      this.scene.game.events.on(EVENTS_NAME.smash, this.smashHandler, this);
      this.on('destroy', () => {
        this.scene.game.events.removeListener(EVENTS_NAME.smash, this.smashHandler, this);
      });

    },
  setType: function (template, target) {
    this.target = target;
    this.scene.physics.world.enableBody(this, 0);
    this.body.setImmovable(true);
    this.hp = template.hp
    this.name = template.name
    this.frame = template.frame
    this.rewards = template.rewards
    this.setFrame(this.frame)

    // if (template.cost) this.totalCost += template.cost;
  },
  smashHandler: function () {

    if (Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) < this.target.width / 2) {
      var rad = Phaser.Math.Angle.BetweenPoints({ x: this.target.x, y: this.target.y }, { x: this.x, y: this.y })
      var deg = Phaser.Math.RadToDeg(rad)
      console.log(deg)
      console.log(face[this.target.facing])
      if (face[this.target.facing] == deg) {

        this.getDamage();
        //  this.disableBody(true, );
        this.hp -= this.scene.player.playerData.power * this.scene.player.playerData.strength
        /*  this.scene.player.playerData.hp -= 1
        this.scene.addScore() */
        var tween = this.scene.tweens.add({
          targets: this,
          alpha: .2,
          yoyo: true,
          duration: 100
        })
        if (this.hp < 1) {
          this.scene.time.delayedCall(100, () => {
            var emitter = this.scene.add.particles('particle_color').createEmitter({

              speed: { min: -200, max: 200 },
              angle: { min: 0, max: 180 },
              scale: { start: 1, end: .25 },
              alpha: { start: .75, end: 0 },
              blendMode: 'SCREEN',
              lifespan: 400,
              frame: [0, 1, 2, 3]
            });
            emitter.explode(20, this.x, this.y);
            let rand = Math.random();
            if (rand < .75) {
              this.scene.placeRandomAt(this.x, this.y, this.rewards)
            }

            this.remove()
          });
        }
      }
    }
  },
  launch: function (x, y) {

    this.setPosition(x, y)


  },
  remove: function () {

    this.destroy()
    /* this.setPosition(450, -50)
    this.setActive(false);
    this.setVisible(false); */
  },

  getDamage: function () {
    console.log('SMASH')
  }


});



let smashTypes = [
  {
    name: 'Chest',
    hp: 4,
    frame: 100,
    rewards: [16, 12, 14, 16, 33]

  },
  {
    name: 'Barrel',
    hp: 2,
    frame: 118,
    rewards: [6, 10, 15, 16, 17, 18, 33, 34, 35]

  },
  {
    name: 'Vase',
    hp: 1,
    frame: 155,
    rewards: [6, 10, 26, 23]

  },
  {
    name: 'Crate',
    hp: 3,
    frame: 160,
    rewards: [7, 8, 9, 13, 17, 18, 19, 20, 21, 23, 25]

  },
  {
    name: 'Bookcase',
    hp: 5,
    frame: 120,
    rewards: [0, 1, 2, 27, 11, 28, 29, 30, 31]

  }
]

