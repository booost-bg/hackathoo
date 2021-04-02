import { random } from '../core/utils';
import { Container, Graphics } from 'pixi.js';
import Bubble from './Bubble';

import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);

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
    bubbleSpawnInterval = 1000,
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

    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._createBar();
    this._setBarCurvePath();
    this._drawBar();
    this._animateWaveMovement();
    this._addEventListener();
    this._setBubbleSpawnInterval(this._bubbleSpawnInterval);
  }

  /**
   * @private
   */
  _createBar() {
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
      topPartx: this._initialWidth,
      botPartx: this._initialWidth,
    };
  }

  /**
   * @private
   */
  _drawBar() {
    this._bar.clear();
    this._bar.moveTo(0, 0);
    this._bar.beginFill('0x000000');
    this._bar.lineTo(this._path.width, 0);
    this._bar.quadraticCurveTo(
      this._path.topPartx,
      window.innerHeight / 4,
      this._path.width,
      window.innerHeight / 2
    );

    this._bar.quadraticCurveTo(
      this._path.botPartx,
      window.innerHeight - window.innerHeight / 4,
      this._path.width,
      window.innerHeight
    );
    this._bar.lineTo(-window.innerWidth * 2, window.innerHeight);
    this._bar.lineTo(-window.innerWidth * 2, 0);
    this._bar.endFill();
  }

  /**
   *  Animate the wave movemenet
   * @param {Number} amplitude wave amplitude
   * @private
   */
  async _animateWaveMovement() {
    gsap.fromTo(
      this._path,
      {
        topPartx: this._path.width - this._amplitude,
        botPartx: this._path.width + this._amplitude,
      },
      {
        topPartx: this._path.width + this._amplitude,
        botPartx: this._path.width - this._amplitude,
        yoyo: true,
        repeat: -1,
        duration: 3,
        ease: 'Power1.easeInOut',
        onUpdate: () => {
          this._drawBar();
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
   * @param {Number} ms interval milliseconds
   * @private
   */
  _setBubbleSpawnInterval(ms) {
    this._interval = setInterval(() => this._createBubble(), ms);
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
}
