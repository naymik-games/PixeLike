class GamePad {
  constructor(scene, main) {
    //super();
    this.scene = scene;//UI
    this.main = main

    // let back = this.scene.add.image(-30, 0, "controlBack").setOrigin(0, 0);


    //
    //
    //
    this.cross = this.scene.add.image(450, 1400, 'cross').setScale(1.5);

    //
    //
    //
    /* this.btn1 = this.scene.add.image(0, 0, "redButton");
    Align.scaleToGameW(this.btn1, .1);
    this.grid.placeAtIndex(18, this.btn1); */
    //
    //
    //
    /*    this.btn2 = this.scene.add.image(0, 0, "redButton");
       Align.scaleToGameW(this.btn2, .1);
       this.grid.placeAtIndex(20, this.btn2); */
    //
    //
    //
    this.btnUp = this.scene.add.image(this.cross.x, this.cross.y - 75, "blank").setScale(.75);
    this.btnDown = this.scene.add.image(this.cross.x, this.cross.y + 75, "blank").setScale(.75);
    this.btnLeft = this.scene.add.image(this.cross.x - 75, this.cross.y, "blank").setScale(.75);
    this.btnRight = this.scene.add.image(this.cross.x + 75, this.cross.y, "blank").setScale(.75);
    //
    //
    //
    this.btnUp.setInteractive();
    this.btnDown.setInteractive();
    this.btnLeft.setInteractive();
    this.btnRight.setInteractive();
    // this.btn1.setInteractive();
    //  this.btn2.setInteractive();
    //
    //
    //
    this.btnUp.on('pointerdown', this.goUp.bind(this));
    this.btnDown.on('pointerdown', this.goDown.bind(this));
    this.btnLeft.on('pointerdown', this.goLeft.bind(this));
    this.btnRight.on('pointerdown', this.goRight.bind(this));

    this.btnUp.on('pointerup', this.goUpDone.bind(this));
    this.btnDown.on('pointerup', this.goDownDone.bind(this));
    this.btnLeft.on('pointerup', this.goLeftDone.bind(this));
    this.btnRight.on('pointerup', this.goRightDone.bind(this));
    // this.btn1.on('pointerdown', this.btn1Pressed.bind(this));
    //  this.btn2.on('pointerdown', this.btn2Pressed.bind(this));
    //
    //
    //
    //
    this.btnUp.alpha = .2;
    this.btnDown.alpha = .2;
    this.btnLeft.alpha = .2;
    this.btnRight.alpha = .2;
    //

  }
  goUp() {
    //console.log("go Up");
    this.main.isUp = false
    this.main.isDown = false
    this.main.isLeft = false
    this.main.isRight = false
    this.main.isUp = true
  }
  goDown() {
    //console.log("go Down");
    this.main.isUp = false
    this.main.isDown = false
    this.main.isLeft = false
    this.main.isRight = false
    this.main.isDown = true
  }
  goLeft() {
    // console.log("go Left")
    this.main.isUp = false
    this.main.isDown = false
    this.main.isLeft = false
    this.main.isRight = false
    this.main.isLeft = true
  }
  goRight() {
    // console.log("go Right");
    this.main.isUp = false
    this.main.isDown = false
    this.main.isLeft = false
    this.main.isRight = false
    this.main.isRight = true
  }

  goUpDone() {
    //console.log("go Up");
    this.main.isUp = false
  }
  goDownDone() {
    //console.log("go Down");

    this.main.isDown = false
  }
  goLeftDone() {
    // console.log("go Left")
    this.main.isLeft = false
  }
  goRightDone() {
    // console.log("go Right");
    this.main.isRight = false
  }
  btn1Pressed() {
    console.log("btn1 pressed");
  }
  btn2Pressed() {
    console.log("btn2 pressed");
  }
}