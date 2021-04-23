import { Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap/all';
import { random } from '../core/utils';

export default class FireworkParticle extends Container {
  constructor() {
    super();

    this.colors = ['0x3295A8', '0xFF00C7', '0xFFE600'];
    this._particles = [];
    this._color = this._getColor;

    this.onCreated();
  }

  onCreated() {
    this._draw();
    this._launchParticle();
  }

  get _getColor() {
    return this.colors[Math.round(random(0, this.colors.length - 1))];
  }

  static get events() {
    return {
      LAUNCHED: 'LAUNCHED',
    }
  }

  /**
   * @private
   * draws the launching particle
   */
  _draw() {
    this._circle = new Graphics();
    this._circle.beginFill(this._color);
    this._circle.drawCircle(0, 0, 2);
    this._circle.endFill();

    this.addChild(this._circle);
  }

  /**
   * @private
   * method used to launch particle
   */
  async _launchParticle() {
    const positonTop = -window.innerHeight / random(2, 5);

    await gsap.timeline({ onComplete: () => this._explode() })
      .to(this._circle, {
        y: positonTop,
        duration: 0.5,
      });

    this.emit(FireworkParticle.events.LAUNCHED, positonTop)
  }

  /**
   * @private
   * @param {String} color 
   */
  _explode() {
    for (let index = 0; index < 80; index++) {
      const circle = new Graphics();
      circle.beginFill(this._color);
      circle.drawCircle(0, this._circle.y, 2);
      circle.endFill();
      this.addChild(circle);
      const filter = new PIXI.filters.ColorMatrixFilter();
      circle.filters = [filter];
      gsap.to(filter, {
        brightness: 10, duration: 1,
      });
      this._particles.push(circle);
    }

    const chunks = this._splitIntoChunks(this._particles, this._particles.length / 5);
    const tl = gsap.timeline();
    tl
      .add(this._addTimeline(chunks))
      .to(chunks, { alpha: 0, duration: 0.4 }, '-=0.3')
      .to(this._circle, { alpha: 0, duration: 0.3 }, '<-0.1');
  }

  /**
   * @private 
   * @param {Array} arr 
   * @param {Number} chunk 
   * @returns array of arrays
   */
  _splitIntoChunks(arr, chunk) {
    const chunks = [];

    while (arr.length > 0) {
      const tempArray = arr.splice(0, chunk);
      chunks.push(tempArray);
    }

    return chunks;
  }

  /**
   * @private
   * @param {Array} arr 
   * @returns gsap timeline
   */
  _addTimeline(arr) {
    const timeline = gsap.timeline({ paused: true });
    const radius = random(100, 300);

    let increment = 0.2;
    arr.forEach(chunk => {
      const dotIncrement = Math.PI * 2 / chunk.length;
      const newRadius = radius * increment;

      const tween = gsap.to(chunk, {
        x: i => newRadius * Math.cos(i * dotIncrement),
        y: i => newRadius * Math.sin(i * dotIncrement),
        ease: 'power3.out',
        duration: 0.6,
      });
      timeline.add(tween, 'fire');

      increment += 0.2;
    });

    return timeline.play();
  }
}
