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
      launched: 'LAUNCHED',
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

    this.emit(FireworkParticle.events.launched, positonTop)
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

    const half = Math.ceil(this._particles.length / 2);

    const firstHalf = this._particles.splice(0, half)
    const secondHalf = this._particles.splice(-half)

    const tl = gsap.timeline();
    const dotIncrement = Math.PI * 2 / firstHalf.length;
    const radius = random(100, 300);
    tl
      .to(firstHalf, {
        x: i => radius * Math.cos(i * dotIncrement),
        y: i => radius * Math.sin(i * dotIncrement),
        ease: 'power3.out',
        duration: 0.6,
      }, 'fire')
      .to(secondHalf, {
        x: i => radius * 0.5 * Math.cos(i * dotIncrement),
        y: i => radius * 0.5 * Math.sin(i * dotIncrement),
        ease: 'power3.out',
        duration: 0.6,
      }, 'fire')
      .to([secondHalf, firstHalf], { alpha: 0, duration: 0.4 }, '<')
      .to(this._circle, { alpha: 0, duration: 0.3 }, '<-1');
  }
}
