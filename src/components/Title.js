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

    this.sortableChildren = true;
    this.text = text;
    this.createTitleText();
    this._width = this._getBoxWidth;
    this.drawTitleBox();
  }

  /**
   * @private
   */
  get _getBoxWidth() {
    const width = this.getChildByName('titleText').width;
    return width + 80;
  }

  /**
   * Draws the box for the title text.
   * @method
   * @private
   */
  drawTitleBox() {
    const box = new Graphics();
    box.beginFill(0xffffff);
    box.drawRect(0, 0, this._width, 50);

    box.pivot.x = this._width / 2;
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
    text.zIndex = 2;
    text.name = 'titleText';
    this.addChild(text);
  }
}
