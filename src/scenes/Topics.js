import Scene from './Scene';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import Button from '../components/Button';
import gsap, { random } from 'gsap/gsap-core';
import Background from '../components/Background';

/**
 * Class representing the Topics scene
 */
export default class Topics extends Scene {
  /**
   * @param {String[]} topics Topics array
   */
  constructor(topics = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']) {
    super();

    this._topics = topics;
    this._container = new Container();
    this._spinning = false;
    this._topicsContainerHeight = null;

    this._config = {
      arrowAnimationOffset: 10,
      arrowPositionOffset: 470,
      topicGap: 6,
      topicsScale: 0.9,
      topicWidth: 820,
      topicHeight: 250,
      minSpinSpeed: 10,
      maxSpinSpeed: 18,
      spinDuration: 10,
      startButton: {
        width: 300,
        height: 50,
      }
    };

    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._addBackground();
    this._addLogo();
    this._addTopics();
    this._addArrows();

    this._container.scale.set(this._config.topicsScale);
    this.addChild(this._container);
    this._addButton();
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
   * Updates the topics' position downwards, highlights the active sector
   * @param {Number} speed How much to move the topics down
   */
  _updateTopicPos(speed) {
    const containers = this.topicsContainer.children;

    containers.forEach((topic) => {
      topic.position.y += speed;
      const topicBounds = topic.getBounds();

      if ((this._arrowPoint > (topicBounds.y - this._config.topicGap / 2))
          && (this._arrowPoint < (topicBounds.y + topicBounds.height + this._config.topicGap / 2 - 1))) {
        topic.children[0].tint = 0xFFFFFF;

        if (this._selectedTopic !== topic) {
          this._playArrowAnimation();
          this._selectedTopic = topic;
        }
      } else {
        topic.children[0].tint = 0xFF00C7;
      }

      topic.position.y = topic.position.y % (this._topicsContainerHeight + this._config.topicGap);
    });
  }

  /**
   * Starts the topic spin animation
   * @priavte
   */
  _spinWheel() {
    if (this._spinning) return;

    const arrowBounds = this._leftArrow.getBounds();
    this._arrowPoint = arrowBounds.y + (arrowBounds.height / 2);
    this._spinning = true;
    this._selectedTopic = null;

    const dummyObj = {
      speed: random(this._config.minSpinSpeed, this._config.maxSpinSpeed),
    };

    const delay = (time) => new Promise((resolve) => setTimeout(() => { resolve(); }, time));

    // Topic anticipation
    const onSpinComplete = async () => {
      const times = Math.round(random(2, 5));
      for (let i = 0; i < times; i++) {
        dummyObj.speed = 3;
        await gsap.to(dummyObj, {
          speed: 0,
          duration: 2,
          onUpdate: () => { this._updateTopicPos(dummyObj.speed); },
        });

        await delay(1000);

        this._spinning = false;
      }
    };

    gsap.to(dummyObj, {
      speed: 0,
      duration: 10,
      onComplete: onSpinComplete,
      onUpdate: () => { this._updateTopicPos(dummyObj.speed); },
    });
  }

  /**
   * Animates the arrows' contraction
   * @private
   */
  _playArrowAnimation() {
    gsap
      .to(this._arrows, {
        keyframes: [
          { x: (_, target) => {
            return target.startPos + (this._config.arrowAnimationOffset * target.scale.x);
          },
          pixi: {
            tint: 0xFFF7B3
          },
          ease: 'power1.inOut',
          duration: 0.1 }, 
          { x: (_, target) => target.startPos,
            pixi: {
              tint: 0xFFE500,
            },
            ease: 'power1.inOut',
            duration: 0.15 
          }
        ],
      });
  }

  /**
   * Adds the START button to the scene
   * @private
   */
  _addButton() {
    const button = new Button({ 
      text: 'START',
      width: this._config.startButton.width,
      height: this._config.startButton.height,
    });
    button.position.y = window.innerHeight / 2 - this._config.startButton.height - 20;
    button.position.x = -this._config.startButton.width / 2;

    button.on('pointerup', this._spinWheel.bind(this));

    this.addChild(button);
  }

  /**
   * Adds the yellow arrows to the scene
   * @private
   */
  _addArrows() {
    const arrowHeight = 400;
    this._arrows = [];

    this._leftArrow = new Graphics();
    this._leftArrow.beginFill(0xFFFFFF);
    this._leftArrow.moveTo(0, 0);
    this._leftArrow.lineTo(arrowHeight / 2.5, arrowHeight / 2);
    this._leftArrow.lineTo(0, arrowHeight);
    this._leftArrow.lineTo(0, 0);
    this._leftArrow.closePath();
    this._leftArrow.endFill();
    this._leftArrow.startPos = -this._config.arrowPositionOffset;
    this._leftArrow.position.x = this._leftArrow.startPos;
    this._leftArrow.pivot.y = arrowHeight / 2;

    this._leftArrowSmall = this._leftArrow.clone();
    this._leftArrowSmall.scale.set(0.5);
    this._leftArrowSmall.startPos = -(this._config.arrowPositionOffset + 150);
    this._leftArrowSmall.position.x = this._leftArrowSmall.startPos;
    this._leftArrowSmall.pivot.y = arrowHeight / 2;

    this._rightArrow = this._leftArrow.clone();
    this._rightArrow.startPos = this._config.arrowPositionOffset;
    this._rightArrow.position.x = this._config.arrowPositionOffset;
    this._rightArrow.scale.x = -1;
    this._rightArrow.pivot.y = arrowHeight / 2;

    this._rightArrowSmall = this._leftArrow.clone();
    this._rightArrowSmall.startPos = this._config.arrowPositionOffset + 150;
    this._rightArrowSmall.position.x = this._rightArrowSmall.startPos;
    this._rightArrowSmall.scale.set(-0.5, 0.5);
    this._rightArrowSmall.pivot.y = arrowHeight / 2;

    this._arrows.push(this._leftArrow, this._leftArrowSmall, this._rightArrow, this._rightArrowSmall);

    this._arrows.forEach((arrow) => {
      arrow.tint = 0xFFE500;
      this._container.addChild(arrow);
    });
  }

  /**
   * Adds the topics container
   * @private
   */
  _addTopics() {
    const mask = new Sprite.from('topicsMask');
    mask.anchor.set(0.5);
    this.topicsContainer = new Container();
    this.topicsContainer.mask = mask;

    // to fix pop in
    if (this._topics.length < 6) this._topics = [...this._topics, ...this._topics];
    
    for (let i = 0; i < this._topics.length; i++) {
      const topicContainer = new Container();

      const topicBackground = new Graphics();
      topicBackground.beginFill(0xFFFFFF);

      topicBackground.drawRect(
        -this._config.topicWidth / 2,
        -this._config.topicHeight / 2,
        this._config.topicWidth,
        this._config.topicHeight
      );

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
      topicContainer.position.y = (i + 1) * (this._config.topicHeight + this._config.topicGap);

      this.topicsContainer.addChild(topicContainer);
    }

    this._topicsContainerHeight = this.topicsContainer.height;
    this.topicsContainer.y = -this.topicsContainer.height / 2;
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