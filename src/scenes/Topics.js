import Scene from './Scene';
import { Sprite } from 'pixi.js';
import Button from '../components/Button';
import Background from '../components/Background';
import TopicsContainer from '../components/TopicsContainer';
import gsap from 'gsap';
import config from '../config';

/**
 * Class representing the Topics scene
 */
export default class Topics extends Scene {
  /**
   * @param {String[]} topics Topics array
   */
  constructor(apiData) {
    super();
    this._apiData = apiData;
    this._config = config.scenes.Topics;
    this._topicsContainer = new TopicsContainer({
      topics: this._apiData.hackathonSettings.topics,
      config: this._config,
      chosenTopic: this._apiData.topic,
      color: this._apiData.hackathonSettings.accentColor
    });

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
    const {
      fx1Color,
      fx2Color,
      mainColor,
      accentColor,
    } = this._apiData.hackathonSettings;
    const background = new Background({
      circleColor1: fx1Color,
      circleColor2: fx2Color,
      bgColor1: mainColor,
      bgColor2: accentColor,
    });

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
    this._startButton.position.y
      = window.innerHeight / 2 - this._config.startButton.height - 20;
    this._startButton.position.x = -this._config.startButton.width / 2;

    this._startButton.once('pointerup', async () => {
      this._hideButton();
      await this._topicsContainer.spinWheel();
      this._finishScene();
    });

    this.addChild(this._startButton);
  }

  /**
   * @private
   */
  _hideButton() {
    gsap.to(this._startButton, {
      pixi: {
        alpha: 0,
      },
      duration: 0.4,
      onComplete: () => this._startButton.visible = 0
    });
  }
  
  _finishScene() {
    this.emit(Scene.events.EXIT, {
      to: 'countdownStart',
      data: this.apiData,
    });
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    // eslint-disable-line no-unused-vars
  }
}
