import { Text, Graphics, Container } from "pixi.js";
export default class Title extends Container {
  constructor(text) {
    super();
    this.text = text;
    this.drawTitleBox();
    this.createTitleText();
  }
  drawTitleBox() {
    const box = new Graphics();
    box.beginFill(0xffffff);
    box.drawRect(0, 0, 400, 75);
    box.pivot.x = 200;
    box.pivot.y = 75 / 2;
    box.y = 200;
    this.addChild(box);
  }

  createTitleText() {
    const text = new Text(this.text, {
      fill: "#000000",
      fontFamily: "sans-serif",
      fontSize: 30,
      fontWeight: 400,
    });
    text.anchor.set(0.5);
    text.y = 200;
    this.addChild(text);
  }
}
