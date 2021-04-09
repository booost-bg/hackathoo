import { Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap/all';
import { random } from '../core/utils';

export default class FireworkParticle extends Container {
  constructor() {
    super();

    this.colors = ['0x3295A8', '0xFF00C7', '0xFFE600'];

    this.onCreated();
  }

  onCreated() {
    this._draw();
    this._launchParticle();
  }

  _draw() {
    this.circle = new Graphics();
    this.color = this.colors[Math.round(random(0, this.colors.length - 1))];
    this.circle.beginFill(this.color);
    this.circle.drawCircle(0, 0, 10);
    this.circle.endFill();

    this.addChild(this.circle);
  }

  async _launchParticle() {
    const posTop = -window.innerHeight / random(2, 6);

    await gsap.timeline({ onComplete: this._explode, onCompleteParams: [this.color, this] })
      .to(this.circle, {
        y: posTop,
        duration: 0.5,
      });
  }

  _explode(color, self) {
    self.particles = []

    for (let index = 0; index < 30; index++) {
      const circle = new Graphics();
      circle.beginFill(color);
      circle.drawCircle(0, self.circle.y, 10);
      circle.endFill();
      self.addChild(circle);
      const filter = new PIXI.filters.ColorMatrixFilter();
      circle.filters = [filter];
      gsap.to(filter, {
        brightness: 10, duration: 1,
      });
      self.particles.push(circle);
    }

    const tl = gsap.timeline();
    const dotIncrement = Math.PI * 2 / self.particles.length;
    const radius = random(100, 300);
    tl
      .to(self.particles, {
        x: i => radius * Math.cos(i * dotIncrement),
        y: i => radius * Math.sin(i * dotIncrement),
        ease: 'back',
        duration: 0.6,
      })
      .to(self.particles, { alpha: 0, duration: 0.4 }, '<')
      .to(self.circle, { alpha: 0, duration: 0.3 }, '<-1');
  }
}
