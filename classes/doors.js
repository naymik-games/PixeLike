var Door = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Door(scene) {

      Phaser.GameObjects.Image.call(this, scene, 450, 0, 'tiles', 0);
      this.setScale(1)
      this.setAlpha(1)
      //this.spawn = spawnPoints[spawnAlt]

      this.scene = scene
      this.scene.physics.world.enableBody(this, 0);
      this.body.setImmovable(true);


    },
  setType: function (template) {


    this.name = template.name
    this.locked = template.locked
    this.keyCode = template.keyCode
    this.frame = template.frame
    this.setFrame(this.frame)
    this.body.setImmovable(true);
    // if (template.cost) this.totalCost += template.cost;
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




});


let doorTypes = [
  {
    name: 'Bronze Door',

    frame: 56,
    locked: false,
    keyCode: 'bronze'

  },

]

