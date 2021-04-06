import { Text, Graphics, Container } from "pixi.js";

/**
 * Represents a scene's title.
 * @class
 */
export default class Title extends Container {
  /**
   *
   * @param {string} text
   */
  constructor(text) {
    super();
    this.text = text;
    this.drawTitleBox();
    this.createTitleText();
  }

  /**
   * Draws the box for the title text.
   * @method
   * @private
   */
  drawTitleBox() {
    const box = new Graphics();
    box.beginFill(0xffffff);
    box.drawRect(0, 0, 400, 50);
    box.pivot.x = 200;
    box.pivot.y = 50 / 2;
    box.y = 0;
    this.addChild(box);
  }

  /**
   * Renders the title's text.
   * @method
   * @private
   */
  createTitleText() {
    const text = new Text(this.text, {
      fill: "#000000",
      fontFamily: "Raleway",
      fontSize: 30,
      fontWeight: 400,
    });
    text.anchor.set(0.5);
    this.addChild(text);
  }
}
