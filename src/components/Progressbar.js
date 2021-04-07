import { random } from '../core/utils';
import { Container, Graphics } from 'pixi.js';
import Bubble from './Bubble';
import gsap from 'gsap';
// Prevent timeline pause when tab is not on focus
gsap.ticker.lagSmoothing(false);

/**
 * Initializes a new instance of Progress
 * @class
 * @extends {PIXI.Container}
 */
export default class Progress extends Container {
  /**
   * @param {Number} initialWidth The wave inital width
   * @param {Number} amplitude The wave amplitude value
   * @param {Number} bubbleSpawnInterval The bubbles spawn time
   * @param {Number} bubbleRadiusMin The bubbles radius min value
   * @param {Number} bubbleRadiusMax The bubbles radius max value
   */
  constructor({
    amplitude = 25,
    initialWidth = 100,
    bubbleSpawnInterval = 700,
    bubbleRadiusMin = 2,
    bubbleRadiusMax = 10,
  } = {}) {
    super();
    this._amplitude = amplitude;
    this._initialWidth = initialWidth;
    this._bubbleSpawnInterval = bubbleSpawnInterval;
    this._bubbleRadiusMin = bubbleRadiusMin;
    this._bubbleRadiusMax = bubbleRadiusMax;

    /**
     * @type {Function}
     * @private
     */
    this._interval = null;
    /**
     * @type {PIXI.Graphics}
     * @private
     */
    this._bar = null;
    /**
     * @type {Object}
     * @private
     */
    this._path = null;

    /**
     * @type {GSAP.timeline}
     * @private
     */
    this._tl = new gsap.timeline();

    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._create();
    this._setBarCurvePath();
    this._draw();
    this._animateWaveMovement();
    this._addEventListener();
    this._setBubbleSpawnInterval();
  }

  /**
   * @private
   */
  _create() {
    this._bar = new Graphics();

    this._bar.alpha = 0.1;

    this.addChild(this._bar);
  }

  /**
   * @private
   */
  _setBarCurvePath() {
    this._path = {
      width: this._initialWidth,
      topPartX: this._initialWidth,
      topPartY: window.innerHeight / 4,
      botPartX: this._initialWidth,
      botPartY: window.innerHeight - window.innerHeight / 4,
    };
  }

  /**
   * @private
   */
  _draw() {
    this._bar.clear();
    this._bar.moveTo(0, 0);
    this._bar.beginFill('0x000000');
    this._bar.lineTo(this._path.width, 0);
    this._bar.quadraticCurveTo(
      this._path.topPartX,
      this._path.topPartY,
      this._path.width,
      window.innerHeight / 2
    );

    this._bar.quadraticCurveTo(
      this._path.botPartX,
      this._path.botPartY,
      this._path.width,
      window.innerHeight
    );
    this._bar.lineTo(-window.innerWidth, window.innerHeight);
    this._bar.lineTo(-window.innerWidth, 0);
    this._bar.endFill();
  }

  /**
   *  Animate the wave movemenet
   * @private
   */
  async _animateWaveMovement() {
    gsap.fromTo(
      this._path,
      {
        topPartX: this._path.width - this._amplitude,
        botPartX: this._path.width + this._amplitude,
      },
      {
        topPartX: this._path.width + this._amplitude,
        botPartX: this._path.width - this._amplitude,
        yoyo: true,
        repeat: -1,
        duration: 3,
        ease: 'Power1.easeInOut',
        onUpdate: () => {
          this._draw();
        },
      },
      'wave'
    );
  }

  /**
   * @private
   */
  _addEventListener() {
    window.addEventListener('blur', () => {
      window.clearInterval(this._interval);
    });
    window.addEventListener('focus', () => {
      this._setBubbleSpawnInterval(this._bubbleSpawnInterval);
    });
  }

  /**
   * @private
   */
  _setBubbleSpawnInterval() {
    this._interval = setInterval(
      () => this._createBubble(),
      this._bubbleSpawnInterval
    );
  }

  /**
   * @private
   */
  _createBubble() {
    const bubble = new Bubble({
      radius: random(this._bubbleRadiusMin, this._bubbleRadiusMax),
    });

    bubble.x = this._bar.getBounds().right;
    bubble.y = random(0, window.innerHeight);
    bubble.on(Bubble.events.ANIMATION_DONE, () => {
      this.removeChild(bubble);
    });

    this.addChild(bubble);
  }

  /**
   * @param {Number} duration duration in milliseconds
   * @public
   */
  start(duration) {
    this._tl.to(this._bar, {
      x: window.innerWidth - this._initialWidth,
      duration: duration / 1000,
      ease: 'none',
    });
  }
}
