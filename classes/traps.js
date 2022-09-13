class Trap extends Actor {
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
      if (
        Phaser.Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          { x: this.target.x, y: this.target.y },
        ) < this.target.width * .75
      ) {
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
    this.setFrame(trapTypes[en].runFrames[0])

    this.name = trapTypes[en].name
    this.type = en
    this.reward = trapTypes[en].reward
    this.rewardItems = trapTypes[en].rewardItems

    this.runKey = trapTypes[en].runKey
    this.runFrames = trapTypes[en].runFrames
    this.power = trapTypes[en].power

    this.setPushable(false)
    this.initAnimations()
    this.anims.play(this.runKey, true);
    this.hp = trapTypes[en].hp
    this.hpMax = trapTypes[en].hpMax

    //this.hpValue.setText(this.hp)
  }
  preUpdate(time, delta) {


    super.preUpdate(time, delta)
    this.anims.play(this.runKey, true);
    // this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    /* 
     if (this.movement == 0) {//homing
       if (
         Phaser.Math.Distance.BetweenPoints(
           { x: this.x, y: this.y },
           { x: this.target.x, y: this.target.y },
         ) < AGRESSOR_RADIUS
       ) {
         
         this.getBody().setVelocity(0);
       }
     } else if (this.movment = 1) {//random walk
       if (time < this.nextAction) {
         return;
       }
      
       
 
       this.nextAction = time + Phaser.Math.Between(1000, 3000);
     }
  */





    /* */
  }
  initAnimations() {

    this.scene.anims.create({
      key: this.runKey,
      frames: this.anims.generateFrameNumbers('traps', { frames: this.runFrames }),
      frameRate: 8,
    });



    // console.log(this.scene.anims)
  }
  setTarget(target) {
    this.target = target;
  }
}
//movement 0 = homing, 1 = random walk
let trapTypes = [
  {
    name: 'Spikes',
    hp: 3,
    hpMax: 3,
    defense: 1,
    power: 2,
    runKey: 'ts-run',
    runFrames: [0, 1, 2, 3, 4, 5],


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
  }
]