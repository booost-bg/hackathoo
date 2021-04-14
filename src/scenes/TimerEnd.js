import Scene from './Scene';
import { Text } from 'pixi.js';
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
