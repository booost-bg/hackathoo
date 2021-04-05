import { Elastic } from "gsap/all";
import gsap from "gsap/gsap-core";
import { Container, Graphics, Text } from "pixi.js";

export default class Button extends Container {
  /**
   * @param {Number} width The button width value
   * @param {Number} height The button height value
   * @param {String} text The button text value
   * @param {String} fontSize The button text font size
   * @param {Number} curveSize The button onclick curve size
   */
  constructor({
    text = "Example",
    fontSize = 18,
    width = 0,
    height = 0,
    curveSize = 10,
  } = {}) {
    super();
    this._width = width;
    this._height = height;
    this._text = text;
    this._fontSize = fontSize;
    this._curveSize = curveSize;

    /**
     * @type {Boolean}
     * @private
     */
    this._animationIsPlaying = false;

    /**
     * Quadratic curve turning points
     * @type {Object}
     * @private
     */
    this._path = {};

    /**
     * @type {PIXI.Graphics}
     * @private
     */
    this._background = null;

    this.interactive = true;
    this.buttonMode = true;

    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._createText();
    this._createBackground();
    this._addText();
    this._setBackgroundCurvePath();
    this._drawBackground();
    this._addEventListener();
  }

  /**
   * @private
   */
  _createText() {
    const buttonText = new Text(this._text, {
      fill: "0xffffff",
      fontFamily: "Raleway",
      fontSize: this._fontSize,
      fontWeight: 700,
      align: "center",
    });

    buttonText.resolution = 2;
    buttonText.anchor.set(0.5);

    this._buttonText = buttonText;
    this.addChild(this._buttonText);
  }

  /**
   * @private
   */
  _createBackground() {
    const background = new Graphics();

    this._background = background;

    if (this._width === 0 && this._height === 0) {
      this._setBackgroundSize();
    }
    this.addChild(this._background);
  }

  /**
   * @private
   */
  _addText() {
    this._buttonText.x = this._width / 2;
    this._buttonText.y = this._height / 2;
    this._background.addChild(this._buttonText);
  }

  /**
   * Set quadratic curve turning points
   * @private
   */
  _setBackgroundCurvePath() {
    this._path = {
      topX: this._width / 2,
      topY: 0,
      rightX: this._width,
      rightY: this._height / 2,
      bottomX: this._width / 2,
      bottomY: this._height,
      leftX: 0,
      leftY: this._height / 2,
    };
  }

  /**
   * @private
   */
  _drawBackground() {
    this._background.clear();
    this._background.beginFill(0x000000);
    this._background.moveTo(0, 0);
    this._background.quadraticCurveTo(
      this._path.topX,
      this._path.topY,
      this._width,
      0
    );
    this._background.quadraticCurveTo(
      this._path.rightX,
      this._path.rightY,
      this._width,
      this._height
    );
    this._background.quadraticCurveTo(
      this._path.bottomX,
      this._path.bottomY,
      0,
      this._height
    );
    this._background.quadraticCurveTo(this._path.leftX, this._path.leftY, 0, 0);
    this._background.endFill();
  }

  /**
   * Set background size based of text if no width and height is providet
   * @private
   */
  _setBackgroundSize() {
    this._width = this._buttonText.width + 50;
    this._height = this._buttonText.height + 20;
  }

  /**
   * @private
   */
  _addEventListener() {
    this.on("pointerdown", () => {
      this._contractAnimation();
    });

    this.on("pointerup", () => {
      this._resetAnimation();
    });
  }

  /**
   * Reset button size on pointerup
   * @private
   */
  _resetAnimation() {
    gsap.to(this._buttonText.scale, {
      ease: Elastic.easeOut.config(3, 0.7),
      x: 1,
      y: 1,
      duration: 0.6,
    });

    gsap.to(this._path, {
      ease: Elastic.easeOut.config(3, 0.7),
      duration: 0.6,
      topY: 0,
      rightX: this._width,
      bottomY: this._height,
      leftX: 0,
      onUpdate: () => {
        this._drawBackground();
      },
    });
  }

  /**
   * Contract button size on pointerdown
   * @private
   */
  async _contractAnimation() {
    gsap.to(this._buttonText.scale, {
      x: 0.9,
      y: 0.9,
      duration: 0.07,
    });

    await gsap.to(this._path, {
      duration: 0.07,
      topY: this._curveSize,
      rightX: this._width - this._curveSize,
      bottomY: this._height - this._curveSize,
      leftX: this._curveSize,
      onUpdate: () => {
        this._drawBackground();
      },
    });
  }
}
