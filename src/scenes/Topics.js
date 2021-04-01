import Scene from './Scene';
import { Container, Graphics, Sprite, Text } from 'pixi.js';

export default class Topics extends Scene {
  constructor(topics = ['TOPIC 1', 'TOPIC 2', 'TOPIC 3', 'TOPIC 4', 'TOPIC 5']) {
    super();

    this._topics = topics;

    this._container = new Container();

    this._init();
  }

  _init() {
    this._addLogo();
    this._addTopics();
    this._addArrows();

    this.addChild(this._container);
    this._container.scale.set(0.8);
  }

  /**
   * Renders the app's logo.
   * @method
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

  _addArrows() {
    const arrowHeight = 400;
    const positionOffset = 470;

    this._leftArrow = new Graphics();
    this._leftArrow.beginFill(0xFFE500);
    this._leftArrow.moveTo(0, 0);
    this._leftArrow.lineTo(arrowHeight / 2.5, arrowHeight / 2);
    this._leftArrow.lineTo(0, arrowHeight);
    this._leftArrow.lineTo(0, 0);
    this._leftArrow.closePath();
    this._leftArrow.endFill();
    this._leftArrow.position.x = -positionOffset;
    this._leftArrow.pivot.y = arrowHeight / 2;

    this._leftArrowSmall = this._leftArrow.clone();
    this._leftArrowSmall.scale.set(0.5);
    this._leftArrowSmall.position.x = -(positionOffset + 150);
    this._leftArrowSmall.pivot.y = arrowHeight / 2;

    this._rightArrow = this._leftArrow.clone();
    this._rightArrow.position.x = positionOffset;
    this._rightArrow.scale.x = -1;
    this._rightArrow.pivot.y = arrowHeight / 2;

    this._rightArrowSmall = this._leftArrow.clone();
    this._rightArrowSmall.position.x = positionOffset + 150;
    this._rightArrowSmall.scale.set(-0.5, 0.5);
    this._rightArrowSmall.pivot.y = arrowHeight / 2;

    this._container.addChild(
      this._leftArrow,
      this._rightArrow,
      this._leftArrowSmall,
      this._rightArrowSmall
    );
  }

  _addTopics() {
    this._topicsGraphics = [];
    const topicWidth = 820;
    const topicHeight = 250;

    const mask = new Sprite.from('topicsMask');
    mask.anchor.set(0.5);
    mask.isMask = true;
    const topicsContainer = new Container();
    topicsContainer.mask = mask;

    for (let i = 0; i < this._topics.length; i++) {
      const topicContainer = new Container();

      const topicBackground = new Graphics();
      topicBackground.beginFill(0xFFFFFF);
      topicBackground.drawRect(-topicWidth / 2, -topicHeight / 2, topicWidth, topicHeight);
      topicBackground.endFill();
      topicBackground.tint = 0xFF00C7;

      const topicText = new Text(this._topics[i], {
        fontFamily: 'Raleway',
        fontSize: 94,
        fontWeight: 900,
        align: 'center',
        fontStyle: 'italic',
      });

      topicText.anchor.set(0.5);
      topicText.resolution = 2;
      topicContainer.addChild(topicBackground, topicText);
      topicContainer.position.y = i * (topicHeight + 5) - ((topicHeight + 5) * (this._topics.length / 2)) + topicHeight / 2;

      topicsContainer.addChild(topicContainer);
    }

    this._container.addChild(topicsContainer);
    this._container.addChild(mask);
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