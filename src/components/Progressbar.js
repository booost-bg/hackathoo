import { random } from '../core/utils';
import { Container, Graphics } from 'pixi.js';
import Bubble from './Bubble';

import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);

export default class Progress extends Container {
  constructor() {
    super();

    this._path = {
      size: 200,
      width: 200,
      width2: 200,
    };
    this._bubbles = [];
    this.tl = new gsap.timeline();
    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._createBar();
    this._drawBar();
    this._animateWaveMovement(30);
    this._addEventListener();
    this._setBubbleSpawnInterval(1000);
  }

  _addEventListener() {
    document.addEventListener('click', () => this._increaseProgressBar());

    window.addEventListener('blur', () => {
      window.clearInterval(this._interval);
    });
    window.addEventListener('focus', () => {
      this._setBubbleSpawnInterval(1000);
    });
  }

  /**
   * @private
   */
  _createBar() {
    this._bar = new Graphics();
    this.addChild(this._bar);
  }

  /**
   * @private
   */
  _setBubbleSpawnInterval(ms) {
    this._interval = setInterval(() => this._createBubbles(), ms);
  }

  /**
   * @private
   */
  _createBubbles() {
    const bubble = new Bubble();

    bubble.x = this._bar.getBounds().right - 90;
    bubble.y = random(0, window.innerHeight);
    bubble.on('done', () => {
      this.removeChild(bubble);
    });

    this.addChild(bubble);
    this._bubbles.push(bubble);
  }

  /**
   * @private
   */
  _drawBar() {
    this._bar.clear();
    this._bar.moveTo(0, 0);
    this._bar.beginFill('0x0C59EB');
    this._bar.lineTo(this._path.size, 0);
    this._bar.quadraticCurveTo(
      this._path.width,
      window.innerHeight / 4,
      this._path.size,
      window.innerHeight / 2
    );

    this._bar.quadraticCurveTo(
      this._path.width2,
      window.innerHeight - window.innerHeight / 4,
      this._path.size,
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
  async _animateWaveMovement(amplitude) {
    this._path.width = this._path.size;
    gsap.fromTo(
      this._path,
      {
        width: this._path.size - amplitude,
        width2: this._path.size + amplitude,
      },
      {
        width: this._path.size + amplitude,
        width2: this._path.size - amplitude,
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
  _increaseProgressBar() {
    gsap.to(this._bar, {
      x: '+=50',
      duration: 3,
    });
  }
}
