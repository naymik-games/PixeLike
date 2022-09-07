var Collectables = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Collectables(scene) {

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
    this.action = template.action
    this.frame = template.frame
    this.setFrame(this.frame)

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

let multiIndexes = [0, 1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
let barrelReward = [6, 10, 15, 16, 17, 18, 33, 34, 35]
let vaseReward = [6, 10, 26, 23]
let chestReward = [16, 12, 14, 16, 33]
let crateReward = [7, 8, 9, 13, 17, 18, 19, 20, 21, 23, 25]
let bookcaseReward = [0, 1, 2, 27, 11, 28, 29, 30, 31]


let objectTypes = [
  {
    name: 'Book 1',
    id: 0,
    frame: 103,
    action: function () {
      this.scene.addToInventory(0)
    }

  },
  {
    name: 'Book 2',
    id: 1,
    frame: 104,
    action: function () {
      this.scene.addToInventory(0)
    }

  },
  {
    name: 'Book 3',
    id: 2,
    frame: 105,
    action: function () {
      this.scene.addToInventory(3)
    }
  },
  {
    name: 'Map',
    frame: 110,
    id: 3,
    action: function () {
      console.log('Map collected')
      this.scene.player.hasMap = true
      this.scene.showMapButton()
    }
  },
  {
    name: 'Block',
    frame: 9,
    id: 4,
  },
  {
    name: 'Key',
    id: 5,
    frame: 123,
    action: function () {
      console.log('key collected')
      this.scene.player.canExit = true
    }

  },
  {
    name: 'Gold',
    frame: 86,
    id: 6,
    action: function () {
      this.scene.player.playerData.gold++
      this.scene.addScore()
    }
  },
  {
    name: 'Potion Orange',
    frame: 112,
    id: 7,
    action: function () {
      this.scene.addToInventory(7)
    }
  },
  {
    name: 'Potion Blue',
    frame: 113,
    id: 8,
    action: function () {
      this.scene.addToInventory(8)
    }
  },
  {
    name: 'Potion Green',
    frame: 114,
    id: 9,
    action: function () {
      this.scene.addToInventory(9)
    }
  },
  {
    name: 'HP',
    frame: 115,
    id: 10,
    action: function () {
      var rand = Phaser.Math.Between(1, 5)
      this.scene.player.playerData.hp += rand
      this.scene.player.hpBar.p = this.scene.player.playerData.hp / this.scene.player.playerData.hpMax
      this.scene.addScore()
    }
  },
  {
    name: 'Paper',
    frame: 119,
    id: 11,
    action: function () {
      this.scene.addToInventory(11)
    }
  },
  {
    name: 'Red Ammulet',
    frame: 124,
    id: 12,
    action: function () {
      this.scene.addToInventory(12)
    }
  },
  {
    name: 'Green Ammulet',
    frame: 125,
    id: 13,
    action: function () {
      this.scene.addToInventory(13)
    }
  },
  {
    name: 'Large Crown',
    frame: 126,
    id: 14,
    action: function () {
      this.scene.addToInventory(14)
    }
  },
  {
    name: 'Skull',
    frame: 127,
    id: 15,
    action: function () {
      this.scene.addToInventory(15)
    }
  },
  {
    name: 'Gold Bar',
    frame: 128,
    id: 16,
    action: function () {
      this.scene.player.playerData.gold += 5
      this.scene.addScore()
    }
  },
  {
    name: 'Gem',
    frame: 129,
    id: 17,
    action: function () {
      this.scene.addToInventory(17)
    }
  },
  {
    name: 'Rhune 1',
    frame: 130,
    id: 18,
    action: function () {
      this.scene.addToInventory(18)
    }
  },
  {
    name: 'Rhune 2',
    frame: 131,
    id: 19,
    action: function () {
      this.scene.addToInventory(19)
    }
  },
  {
    name: 'Rhune 3',
    frame: 132,
    id: 20,
    action: function () {
      this.scene.addToInventory(20)
    }
  },
  {
    name: 'Rhune 4',
    frame: 133,
    id: 21,
    action: function () {
      this.scene.addToInventory(21)
    }
  },
  {
    name: 'Rhune 5',
    frame: 134,
    id: 22,
    action: function () {
      this.scene.addToInventory(22)
    }
  },
  {
    name: 'Small Crown',
    frame: 135,
    id: 23,
    action: function () {
      this.scene.addToInventory(23)
    }
  },
  {
    name: 'Gold Key',
    frame: 136,
    id: 24,
    action: function () {
      this.scene.addToInventory(24)
    }
  },
  {
    name: 'Silver Key',
    frame: 137,
    id: 25,
    action: function () {
      this.scene.addToInventory(25)
    }
  },
  {
    name: 'Bronze Key',
    frame: 138,
    id: 26,
    action: function () {
      this.scene.addToInventory(26)
    }
  },
  {
    name: 'Book 4',
    id: 27,
    frame: 105,
    action: function () {
      this.scene.addToInventory(27)
    }
  },
  {
    name: 'Scroll 1',
    id: 28,
    frame: 150,
    action: function () {
      this.scene.addToInventory(28)
    }
  },
  {
    name: 'Scroll 2',
    id: 29,
    frame: 151,
    action: function () {
      this.scene.addToInventory(29)
    }
  },
  {
    name: 'Scroll 3',
    id: 30,
    frame: 152,
    action: function () {
      this.scene.addToInventory(30)
    }
  },
  {
    name: 'Scroll 4',
    id: 31,
    frame: 153,
    action: function () {
      this.scene.addToInventory(31)
    }
  },
  {
    name: 'Candle',
    id: 32,
    frame: 93,
    action: function () {
      this.scene.addToInventory(32)
    }
  },
  {
    name: 'Steak',
    id: 33,
    frame: 147,
    action: function () {
      this.scene.addToInventory(33)
    }
  },
  {
    name: 'Carrot',
    id: 34,
    frame: 148,
    action: function () {
      this.scene.addToInventory(34)
    }
  },
  {
    name: 'Cheese',
    id: 35,
    frame: 149,
    action: function () {
      this.scene.addToInventory(35)
    }
  }
]

