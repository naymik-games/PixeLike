let buttonStyle1 = {
  fontSize: '85px',
  fill: '##483B3A',
  fontFamily: 'CustomFont'
};
//var buttonTest = new Button(this, game.config.width / 2, game.config.height / 2 + 125, 'OK', buttonStyle1, this.close, true)
class Button {
  constructor(scene, x, y, text, style, callback, outline) {
    var text = scene.add.text(x, y, text, style);
    text.setOrigin(0.5, 0.5);
    text.setInteractive();
    if (callback) {
      text.on('pointerup', callback, scene);
    }
    if (outline) {
      Button.createOutline(scene, x, y, text.width, text.height);
    }
  }
  static createOutline(scene, x, y, width, height) {
    var graphics, padding;
    graphics = scene.add.graphics(),
      padding = 18;
    width = width;
    x = x - width / 2 - (padding / 2) - 1;
    y = y - height / 2 - padding / 2;
    width = width + padding;
    height = height + padding;
    graphics.lineStyle(5, 0x262B44, 2);
    graphics.strokeRoundedRect(x, y, width, height, 8);
    graphics.fillStyle(0xffff00, 1);
  }
}