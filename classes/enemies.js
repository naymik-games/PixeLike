class Enemy extends Actor {
  // private target: Player;
  // private AGRESSOR_RADIUS = 100;
  // private attackHandler: () => void;

  constructor(
    scene,
    x,
    y,
    texture,
    target,
    frame
  ) {
    super(scene, x, y, texture, frame);

    this.target = target;
    this.type = 0
    this.nextAction = 0
    this.attackHandler = () => {
      if (Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) < this.target.width * .75) {
        var rad = Phaser.Math.Angle.BetweenPoints({ x: this.target.x, y: this.target.y }, { x: this.x, y: this.y })
        var deg = Phaser.Math.RadToDeg(rad)
        console.log(deg)
        console.log(face[this.target.facing])
        if (face[this.target.facing] > deg - 10 && face[this.target.facing] < deg + 10) {
          var tween = this.scene.tweens.add({
            targets: this,
            alpha: .2,
            yoyo: true,
            duration: 100
          })
          this.hp -= this.scene.player.playerData.power * this.scene.player.playerData.strength
          this.scene.player.playerData.hp -= 1
          this.hpBar.p = this.hp / this.hpMax
          //this.hpValue.setText(this.hp)
          if (this.hp < 1) {
            // this.anims.play(this.dieKey, true);
            this.disableBody(true, false);
            this.scene.player.playerData.skillProgress += this.reward
            this.scene.player.skillPop(this.reward)
            this.scene.addScore()
            let rand = Math.random();
            if (rand < .75) {
              this.scene.placeRandomAt(this.x, this.y, this.rewardItems)
            }
            this.scene.time.delayedCall(300, () => {
              this.destroy();

            });
          }
        }
      }
    };

    // ADD TO SCENE
    scene.add.existing(this);
    scene.physics.add.existing(this);
    //this.hpValue = scene.add.text(x, y, '0', { fontFamily: 'Arial', fontSize: 12, color: '#fff' }).setOrigin(0.8, 0.5);

    // PHYSICS MODEL
    this.getBody().setSize(16, 16);
    //  this.getBody().setOffset(0, 0);

    // EVENTS
    this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    this.on('destroy', () => {
      //this.hpValue.destroy()
      this.hpBar.bar.destroy()
      var emitter = this.scene.add.particles('particle_color').createEmitter({

        speed: { min: -300, max: 300 },
        angle: { min: 0, max: 360 },
        scale: { start: 4, end: .25 },
        alpha: { start: 1, end: 0 },
        blendMode: 'SCREEN',
        lifespan: 400,
        frame: [0, 1, 2, 3]
      });
      emitter.explode(20, this.x, this.y);
      this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler);
    });
  }
  setType(scene, en) {
    this.setScale(1)
    this.setFrame(enemyTypes[en].runFrames[0])

    this.name = enemyTypes[en].name
    this.type = en
    this.reward = enemyTypes[en].reward
    this.rewardItems = enemyTypes[en].rewardItems
    this.speed = enemyTypes[en].speed
    this.runKey = enemyTypes[en].runKey
    this.runFrames = enemyTypes[en].runFrames
    this.power = enemyTypes[en].power
    this.movement = enemyTypes[en].movement
    this.setPushable(false)
    this.initAnimations()
    this.anims.play(this.runKey, true);
    this.hp = enemyTypes[en].hp
    this.hpMax = enemyTypes[en].hpMax
    this.hpBar = new HealthBar(scene, this.x, this.y - this.height * 0.4);
    //this.hpValue.setText(this.hp)
  }
  preUpdate(time, delta) {


    super.preUpdate(time, delta)
    // this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    this.hpBar.x = this.x - 8
    this.hpBar.y = this.y - this.height * 0.7
    this.hpBar.draw()
    if (this.movement == 0) {//homing
      if (
        Phaser.Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          { x: this.target.x, y: this.target.y },
        ) < AGRESSOR_RADIUS
      ) {
        this.getBody().setVelocityX(this.target.x - this.x);
        this.getBody().setVelocityY(this.target.y - this.y);
        /* var rotation = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.body.velocity.x = Math.cos(rotation) * 100;
        this.body.velocity.y = Math.sin(rotation) * 100; */
        this.anims.play(this.runKey, true);
      } else {
        this.getBody().setVelocity(0);
      }
    } else if (this.movment = 1) {//random walk
      if (time < this.nextAction) {
        return;
      }
      var speed = this.speed

      // this.scene.anims.play(this.runKey, true);

      if (Phaser.Math.Between(0, 1) === 0) {
        this.body.setVelocity(0);
        var endCol = Math.floor(this.x / 16);
        var endRow = Math.floor(this.y / 16);
        var x = endCol * 16 + 16 / 2;
        var y = endRow * 16 + 16 / 2;
        this.setPosition(x, y)
        //this.sprite.anims.play(Graphics.slime.animations.idle.key, true);
      } else {
        const direction = Phaser.Math.Between(0, 3);
        this.body.setVelocity(0);
        var endCol = Math.floor(this.x / 16);
        var endRow = Math.floor(this.y / 16);
        var x = endCol * 16 + 16 / 2;
        var y = endRow * 16 + 16 / 2;
        this.setPosition(x, y)
        if (!this.body.blocked.left && direction === 0) {
          this.body.setVelocityX(-speed);
        } else if (!this.body.blocked.right && direction <= 1) {
          this.body.setVelocityX(speed);
        } else if (!this.body.blocked.up && direction <= 2) {
          this.body.setVelocityY(-speed);
        } else if (!this.body.blocked.down && direction <= 3) {
          this.body.setVelocityY(speed);
        } else {
          console.log(`Couldn't find direction for slime: ${direction}`);
        }
      }

      this.nextAction = time + Phaser.Math.Between(1000, 3000);
    }






    /* */
  }
  initAnimations() {

    this.scene.anims.create({
      key: this.runKey,
      frames: this.anims.generateFrameNumbers('enemies', { frames: this.runFrames }),
      frameRate: 12,
    });



    // console.log(this.scene.anims)
  }
  setTarget(target) {
    this.target = target;
  }
}
//movement 0 = homing, 1 = random walk
let enemyTypes = [
  {
    name: 'Demon',
    hp: 3,
    hpMax: 3,
    defense: 1,
    power: 2,
    runKey: 'd-run',
    runFrames: [0, 1, 2, 3],

    speed: 100,
    movement: 0,
    reward: 2,
    rewardItems: [6, 10, 10, 10]
  },
  {
    name: 'Skeleton',
    hp: 4,
    hpMax: 4,
    defense: 1,
    power: 1,
    runKey: 's-run',
    runFrames: [5, 6, 7, 8],

    speed: 25,
    movement: 1,
    reward: 1,
    rewardItems: [6, 10]
  },
  {
    name: 'Slime',
    hp: 4,
    hpMax: 4,
    defense: 2,
    power: 1,
    runKey: 's-run',
    runFrames: [20, 21, 22, 23],

    speed: 80,
    movement: 0,
    reward: 1,
    rewardItems: [6, 10]
  }
]