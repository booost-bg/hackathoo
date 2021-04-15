import Scene from './Scene';
import { Sprite } from 'pixi.js';
import Title from '../components/Title';
import Button from '../components/Button';
import Background from '../components/Background';
import Join from '../components/Join';

/**
 * Represents the intro scene of the app.
 * @class
 */
export default class Intro extends Scene {
  constructor() {
    super();
  }
  async onCreated() {
    this.renderBackground();
    this.drawLogo();
    this.drawTitle();
    this.drawCreateButton();
    this.drawJoinButton();
  }

  /**
   * Renders the logo on the stage.
   * @method
   * @private
   */
  drawLogo() {
    const logo = new Sprite.from('logo');
    logo.anchor.set(0.5);
    logo.scale.x = 0.8;
    logo.scale.y = 0.8;
    this.addChild(logo);
  }

  /**
   * Renders the scene's title
   * @method
   * @private
   */
  drawTitle() {
    const title = new Title('The missing hackathon app');
    title.y += 200;
    this.addChild(title);
  }

  /**
   * Draws the create button of the scene.
   * @method
   * @private
   */
  drawCreateButton() {
    const buttonConfig = {
      text: 'CREATE',
      fontSize: 24,
      width: 367,
      height: 53,
      curveSize: 13,
      y: 320,
    };
    const button = new Button(buttonConfig);
    button.pivot.x = buttonConfig.width / 2;
    button.pivot.y = buttonConfig.height / 2;
    button.y += buttonConfig.y;
    this.addChild(button);

    button.once('click', () => this._createHandler());
  }

  /**
 * Draws the join button of the scene.
 * @method
 * @private
 */
  drawJoinButton() {
    const buttonConfig = {
      text: 'JOIN',
      fontSize: 24,
      width: 367,
      height: 53,
      curveSize: 13,
      y: 390,
    };
    const button = new Button(buttonConfig);
    button.pivot.x = buttonConfig.width / 2;
    button.pivot.y = buttonConfig.height / 2;
    button.y += buttonConfig.y;
    this.addChild(button);

    button.once('click', () => this._joinHandler());
  }

  /**
   * Handles the create button click.
   * @method
   * @private
   */
  _createHandler() {
    this.finishScene();
  }

  /**
   * Handles the join button click.
   * @method
   * @private
   */
  _joinHandler() {
    const join = new Join();
    document.body.appendChild(join.body);
  };

  /**
   * Emits a finish event
   * @method
   * @private
   */
  finishScene() {
    this.emit(Scene.events.EXIT, {
      to: "setup",
    });
  }

  /**
   * Renders the background of the scene.
   * @method
   * @private
   */
  renderBackground() {
    const background = new Background();
    this.addChild(background);
  }
}
