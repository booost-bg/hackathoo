import Scene from './Scene';
import { Sprite } from 'pixi.js';
import Button from '../components/Button';
import Background from '../components/Background';
import TopicsContainer from '../components/TopicsContainer';

/**
 * Class representing the Topics scene
 */
export default class Topics extends Scene {
  /**
   * @param {String[]} topics Topics array
   */
  constructor(topics = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']) {
    super();
    
    this._config = {
      arrowAnimationOffset: 10,
      arrowPositionOffset: 470,
      topicGap: 6,
      topicsScale: 0.9,
      topicWidth: 820,
      topicHeight: 250,
      minSpinSpeed: 12,
      maxSpinSpeed: 18,
      startButton: {
        width: 300,
        height: 50,
      }
    };
    
    this._topicsContainer = new TopicsContainer({ topics, config: this._config });
    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._addBackground();
    this._addLogo();
    this._addButton();
    this.addChild(this._topicsContainer);
  }

  /**
   * Adds the background to the scene
   * @private
   */
  _addBackground() {
    const background = new Background();

    this.addChild(background);
  }

  /**
   * Renders the app's logo.
   * @private
   */
  _addLogo() {
    const logo = new Sprite.from('logo');

    logo.anchor.set(0.5);
    logo.scale.x = 0.4;
    logo.scale.y = 0.4;
    logo.y = -window.innerHeight / 2 + 70;

    this.addChild(logo);
  }

  /**
   * Adds the START button to the scene
   * @private
   */
  _addButton() {
    this._startButton = new Button({ 
      text: 'START',
      width: this._config.startButton.width,
      height: this._config.startButton.height,
    });
    this._startButton.position.y = window.innerHeight / 2 - this._config.startButton.height - 20;
    this._startButton.position.x = -this._config.startButton.width / 2;

    this._startButton.once('pointerup', () => { 
      this._topicsContainer.spinWheel(); 
    });

    this.addChild(this._startButton);
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars

  }
}