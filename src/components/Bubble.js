import { Graphics } from 'pixi.js';
import gsap from 'gsap';
import { random } from '../core/utils';

const EVENTS = {
  ANIMATION_DONE: 'animation_done',
};

/**
 * Initializes a new instance of Bubble
 * @class
 * @extends {PIXI.Graphics}
 */
export default class Bubble extends Graphics {
  /**
   * @param {Number} x The X coordinate of the center of the circle
   * @param {Number} x The Y coordinate of the center of the circle
   * @param {Number} radius The radius of the circle
   * @param {Number} color The color of the circle
   */
  constructor({ x = 0, y = 0, radius = 5, color = '0x000000' } = {}) {
    super();
    this._x = x;
    this._y = y;
    this._radius = radius;
    this._color = color;
    /**
     * @type {PIXI.Graphics}
     * @private
     */
    this._bubble = null;

    this._create();
    this._animate();
  }

  /**
   * @private
   */
  static get events() {
    return EVENTS;
  }

  /**
   * @private
   */
  _create() {
    const bubble = new Graphics();

    bubble.beginFill(this._color);
    bubble.drawCircle(this._x, this._y, this._radius);
    bubble.endFill();
    bubble.alpha = 0;

    this._bubble = bubble;
    this.addChild(bubble);
  }

  /**
   * Bubble movement animation
   * @private
   */
  async _animate() {
    const tl = new gsap.timeline();

    await tl
      .to(this._bubble, {
        x: random(55, 200),
        duration: 5,
        ease: 'Power1.easeIn',
      })
      .to(
        this._bubble,
        {
          alpha: 0.1,
          duration: 1,
        },
        '<1'
      );

    await tl
      .to(this._bubble, {
        motionPath: {
          path: [
            this._generateRandomPoint(40, -40, -50, -100),
            this._generateRandomPoint(-40, 40, -100, -150),
            this._generateRandomPoint(-40, 40, -150, -300),
          ],
          align: this.body,
        },
        duration: 5,
      })
      .to(
        this._bubble,
        {
          alpha: 0,
          duration: 2,
          onComplete: () => {
            this.emit(Bubble.events.ANIMATION_DONE);
          },
        },
        '>-2'
      );
  }

  /**
   * Create random point for bubble animation path
   * @param {Number} xMin x coordinate min value
   * @param {Number} xMax x coordinate max value
   * @param {Number} yMin y coordinate min value
   * @param {Number} yMax y coordinate max value
   * @private
   */
  _generateRandomPoint(xMin, xMax, yMin, yMax) {
    return {
      x: this._bubble.x + random(xMin, xMax),
      y: this._bubble.y + random(yMin, yMax),
    };
  }
}
