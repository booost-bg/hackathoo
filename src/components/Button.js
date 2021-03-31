import gsap from 'gsap/gsap-core';
import { Container, Graphics, Text } from 'pixi.js';

export default class Button extends Container {
  /**
   * @param {Number} width The button width value
   * @param {Number} height The button height value
   * @param {String} text The button text value
   * @param {Number} curveSize The button onclick curve size
   */
  constructor(width, height, text, curveSize = 10) {
    super();
    this._width = width;
    this._height = height;
    this._text = text;
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
    this._createBackground();
    this._setBackgroundCurvePath();
    this._drawBackground();
    this._addText();
    this._addEventListener();
  }

  /**
   * @private
   */
  _createBackground() {
    const background = new Graphics();

    this._background = background;
    this.addChild(this._background);
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
  }

  /**
   * @private
   */
  _addText() {
    const text = new Text(this._text, {
      fill: '0xffffff',
      fontFamily: 'Raleway',
      fontSize: 18,
      fontWeight: 700,
    });

    text.anchor.set(0.5);
    text.x = this._background.width / 2;
    text.y = this._background.height / 2;

    this.addChild(text);
  }

  /**
   * @private
   */
  _addEventListener() {
    this.on('click', () => {
      if (this._animationIsPlaying) return;
      this._animate();
    });
  }

  /**
   * Button animation
   * @private
   */
  async _animate() {
    this._animationIsPlaying = true;

    await gsap.to(this._path, {
      duration: 0.3,
      topY: -this._curveSize,
      rightX: this._width + this._curveSize,
      bottomY: this._height + this._curveSize,
      leftX: -this._curveSize,
      repeat: 1,
      yoyo: true,
      ease: 'Back.easeInOut',

      onUpdate: () => {
        this._drawBackground();
      },
    });

    this._animationIsPlaying = false;
  }
}
