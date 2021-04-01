import Scene from './Scene';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import Button from '../components/Button';
import gsap, { random } from 'gsap/gsap-core';

export default class Topics extends Scene {
  constructor(topics = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']) {
    super();

    this._topics = topics;

    this._container = new Container();
    this.arrowPositionOffset = 470;
    this.spinning = false;

    this._init();
  }

  _init() {
    this._addLogo();
    this._addTopics();
    this._addArrows();

    this.addChild(this._container);
    this._container.scale.set(0.9);
    this._addButton();
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

  _spinWheel() {
    if (this.spinning) return;
    const containers = this.topicsContainer.children;
    const topPosition = containers[0].position.y;
    const botPosition = containers[containers.length - 1].position.y;

    const arrowBounds = this._leftArrow.getBounds();
    const arrowPoint = arrowBounds.y + (arrowBounds.height / 2);

    this.spinning = true;
    const dummyObj = {
      y: random(7, 10),
    };

    let selectedTopic = null;

    gsap.to(dummyObj, {
      y: 0,
      duration: 10,
      onComplete: () => this.spinning = false,
      onUpdate: () => {
        containers.forEach((topic) => {
          topic.position.y += dummyObj.y;
          const topicBounds = topic.getBounds();

          if ((arrowPoint > topicBounds.y) && (arrowPoint < (topicBounds.y + topicBounds.height))) {
            topic.children[0].tint = 0xFFFFFF;

            if (selectedTopic !== topic) {
              this._playArrowAnimation();
              selectedTopic = topic;
            }
          } else {
            topic.children[0].tint = 0xFF00C7;
          }

          if (topic.position.y >= (botPosition + topic.height)) {
            topic.position.y = topPosition - 10;
          }
        });
      },
      repeat: 0,
    });
  }

  async _playArrowAnimation() {
    const posOffset = this.arrowPositionOffset - 100;
    if (this.arrowAnimation) this.arrowAnimation.clear();
    this.arrowAnimation = gsap.timeline()
      .to(this._leftArrow, {
        keyframes: [
          { x: -posOffset, duration: 0.2 }, 
          { x: -this.arrowPositionOffset, ease: 'power1.in', duration: 0.3 }
        ] 
      })
      .to(this._rightArrow, {
        keyframes: [
          { x: posOffset, duration: 0.2 }, 
          { x: this.arrowPositionOffset, ease: 'power1.in', duration: 0.3 }
        ]
      }, '<')
      .to(this._leftArrowSmall, {
        keyframes: [
          { x: -posOffset - 150, duration: 0.2 }, 
          { x: -this.arrowPositionOffset - 150, ease: 'power1.in', duration: 0.3 }
        ] 
      }, '<')
      .to(this._rightArrowSmall, {
        keyframes: [
          { x: posOffset + 150, duration: 0.2 }, 
          { x: this.arrowPositionOffset + 150, ease: 'power1.in', duration: 0.3 }
        ] 
      }, '<');
  }

  _addButton() {
    const buttonWidth = 300;
    const buttonHeight = 50;
    const button = new Button({ 
      text: 'START',
      width: buttonWidth,
      height: buttonHeight,
    });
    button.position.y = window.innerHeight / 2 - buttonHeight - 20;
    button.position.x = -buttonWidth / 2;

    button.on('pointerup', this._spinWheel.bind(this));

    this.addChild(button);
  }

  _addArrows() {
    const arrowHeight = 400;

    this._leftArrow = new Graphics();
    this._leftArrow.beginFill(0xFFE500);
    this._leftArrow.moveTo(0, 0);
    this._leftArrow.lineTo(arrowHeight / 2.5, arrowHeight / 2);
    this._leftArrow.lineTo(0, arrowHeight);
    this._leftArrow.lineTo(0, 0);
    this._leftArrow.closePath();
    this._leftArrow.endFill();
    this._leftArrow.position.x = -this.arrowPositionOffset;
    this._leftArrow.pivot.y = arrowHeight / 2;

    this._leftArrowSmall = this._leftArrow.clone();
    this._leftArrowSmall.scale.set(0.5);
    this._leftArrowSmall.position.x = -(this.arrowPositionOffset + 150);
    this._leftArrowSmall.pivot.y = arrowHeight / 2;

    this._rightArrow = this._leftArrow.clone();
    this._rightArrow.position.x = this.arrowPositionOffset;
    this._rightArrow.scale.x = -1;
    this._rightArrow.pivot.y = arrowHeight / 2;

    this._rightArrowSmall = this._leftArrow.clone();
    this._rightArrowSmall.position.x = this.arrowPositionOffset + 150;
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
    this.topicsContainer = new Container();
    this.topicsContainer.mask = mask;

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
        padding: 20
      });

      topicText.anchor.set(0.5);
      topicText.resolution = 2;
      topicContainer.addChild(topicBackground, topicText);
      topicContainer.position.y = i * (topicHeight + 10) - ((topicHeight) * (this._topics.length / 2)) + topicHeight / 2;

      this.topicsContainer.addChild(topicContainer);
    }

    this._container.addChild(this.topicsContainer);
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