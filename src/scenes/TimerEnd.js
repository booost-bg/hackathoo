import Scene from './Scene';
import { Text, Sprite } from 'pixi.js';
import Title from '../components/Title';
import Background from '../components/Background';
import Firework from '../components/Firework';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

export default class TimerEnd extends Scene {
  constructor() {
    super();
  }

  onCreated() {
    this._drawBackground();
    this._drawFirework();
    this._addText();
    this._drawTitle();
  }

  static get events() {
    return {
      firework: 'NEW_FIREWORK',
    }
  }

  /**
   * @private
   */
  _drawBackground() {
    const background = new Background();
    this.addChild(background);
  }

  /**
   * @private
   */
  _drawFirework() {
    const firework = new Firework();
    this.addChild(firework);

    firework.on(TimerEnd.events.firework, (position) => this._addShockwave(position));
  }

  /**
   * Adding shockwave effect to the firework
   * @param {Object} position 
   */
  async _addShockwave(position) {
    const displacementSprite = new Sprite.from('displacement');
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

    this.addChild(displacementSprite);
    this.filters = [displacementFilter];

    displacementSprite.anchor.set(0.5);
    displacementSprite.position.set(position.x, position.y);
    displacementSprite.scale.set(0);

    await gsap.to(displacementSprite, {
      pixi: {
        scale: 4,
      },
      duration: 0.8,
    });

    this.removeChild(displacementSprite);
  }

  /**
   * @private
   */
  _addText() {
    const text = new Text('Time\'s UP!', {
      fill: '#FFFFFF',
      fontFamily: 'Raleway',
      fontSize: 200,
      fontWeight: 600,
    });
    text.anchor.set(0.5);

    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);

    const tl = gsap.timeline({ repeat: 3 })
      .to(text, {
        pixi: {
          tint: 0x000000,
        },
        duration: 1.5,
        ease: 'steps(1)',
      });

    this.addChild(text);
  }

  /**
   * @private
   */
  _drawTitle() {
    const title = new Title('Please wait while the tasks are rated');
    title.y = 200;
    this.addChild(title);
  }
}
