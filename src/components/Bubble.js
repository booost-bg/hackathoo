import { Container, Graphics, Sprite, Point } from 'pixi.js';
import gsap from 'gsap';
import { random } from '../core/utils';

export default class Bubble extends Container {
  constructor() {
    super();

    this._init();
    this._animateBubbles();
  }

  _init() {}
  _createBubble() {
    const bubble = new Graphics();
    bubble.beginFill(0x0c59eb);
    bubble.drawCircle(50, 50, random(2, 7));
    bubble.endFill();
    bubble.alpha = 0;
    this._bubble = bubble;
    this.addChild(bubble);
  }
  _generateRandomPoint(xMin, xMax, yMin, yMax) {
    return {
      x: this._bubble.x + random(xMin, xMax),
      y: this._bubble.y + random(yMin, yMax),
    };
  }

  async _animateBubbles() {
    const tl = new gsap.timeline();
    await tl
      .to(this._bubble, {
        x: 100,
        duration: 5,
        ease: 'Power1.easeIn',
      })
      .to(
        this._bubble,
        {
          alpha: 1,
          duration: 2,
        },
        '<+1'
      );
    await tl
      .to(this._bubble, {
        motionPath: {
          path: [
            this._generateRandomPoint(-50, 50, -50, -100),
            this._generateRandomPoint(-50, 50, -100, -150),
            this._generateRandomPoint(-50, 50, -150, -300),
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
            this.emit('done');
          },
        },
        '>-2'
      );
  }
}
