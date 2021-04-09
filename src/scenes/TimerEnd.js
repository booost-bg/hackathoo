import Scene from './Scene';
import { Text } from 'pixi.js';
import Title from '../components/Title';
import Background from '../components/Background';
import Firework from '../components/Firework';

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

  _drawBackground() {
    const background = new Background();
    this.addChild(background);
  }

  _drawFirework() {
    const firework = new Firework();
    this.addChild(firework);
  }

  _addText() {
    const text = new Text('Time\'s UP!', {
      fill: ['#FFFFFF', '#000000'],
      fillGradientType: 1,
      fontFamily: 'Raleway',
      fontSize: 200,
      fontWeight: 600,
    });
    text.anchor.set(0.5);
    this.addChild(text);
  }

  _drawTitle() {
    const title = new Title('Please wait while the tasks are rated');
    title.y = 200;
    this.addChild(title);
  }
}
