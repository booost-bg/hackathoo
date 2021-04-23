import { Container, Graphics, Sprite, Text } from 'pixi.js';
import gsap, { random } from 'gsap/gsap-core';

export default class TopicsContainer extends Container {
  constructor({ topics, config, chosenTopic }) {
    super();

    this._topics = topics;
    this._config = config;
    this._chosenTopic = chosenTopic;

    this._spinning = false;
    this._topicsContainerHeight = null;

    this._init();
  }

  _init() {
    this._addTopics();
    this._addArrows();
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

      if (
        this._arrowPoint > topicBounds.y - this._config.topicGap / 2 
        && this._arrowPoint < topicBounds.y + topicBounds.height + this._config.topicGap / 2 - 1
      ) {
        topic.children[0].tint = 0xffffff;

        if (this._selectedTopic !== topic) {
          this._playArrowAnimation();
          this._selectedTopic = topic;
        }
      } else {
        topic.children[0].tint = 0xff00c7;
      }

      topic.position.y = topic.position.y % (this._topicsContainerHeight + this._config.topicGap);
    });
  }

  /**
   * Starts the topic spin animation
   */
  async spinWheel() {
    if (this._spinning) return;

    const arrowBounds = this._leftArrow.getBounds();

    this._arrowPoint = arrowBounds.y + arrowBounds.height / 2;
    this._spinning = true;
    this._selectedTopic = null;

    const dummyObj = {
      speed: random(this._config.minSpinSpeed, this._config.maxSpinSpeed),
    };

    await gsap.to(dummyObj, {
      speed: 1.5,
      ease: 'power2.inOut',
      duration: random(10, 15),

      onUpdate: () => {
        this._updateTopicPos(dummyObj.speed);
      },
    });

    await this._spinToChosenTopic();
    await this._onSpinComplete();

    return;
  }

  /**
   * Continues spinning till it reaches the chosen topic
   * @private
   */
  _spinToChosenTopic() {
    return new Promise((resolve) => {
      const dummyObj = { speed: 1.5 };
  
      if (this._selectedTopic.topic === this._chosenTopic) {
        resolve();
      }

      const tween = gsap.to(dummyObj, {
        speed: 1.5,
        repeat: -1,
  
        onUpdate: async () => {
          this._updateTopicPos(dummyObj.speed);
          if (this._selectedTopic.topic === this._chosenTopic) {
            tween.kill();

            dummyObj.speed = 1.5;
            await gsap.to(dummyObj, {
              speed: 0,
              onUpdate: () => { this._updateTopicPos(dummyObj.speed); }
            });
            resolve();
          }
        }
      });
    });
  }

  /**
   * Called when the spinning is complete.
   * @private
   */
  async _onSpinComplete() {
    this._spinning = false;

    const topics = this.topicsContainer.children;
    const bounds = this._selectedTopic.getBounds();
    const offset = window.innerHeight / 2 - (bounds.y + bounds.height / 2);

    return gsap
      .timeline()
      .to(
        [
          this._arrows,
          this._startButton,
          ...topics.filter((t) => t !== this._selectedTopic),
        ],
        {
          alpha: 0,
        }
      )
      .to(this.topicsContainer.mask, {
        pixi: {
          scale: 2,
        },
      })
      .to(
        this._selectedTopic,
        {
          duration: 1,
          ease: 'back',
          pixi: {
            scale: 1.5,
            y: `+=${offset}`,
          },
        },
        '<'
      );
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
    if (this._topics.length < 6) { this._topics = [...this._topics, ...this._topics]; }

    for (let i = 0; i < this._topics.length; i++) {
      const topicContainer = new Container();

      const topicBackground = new Graphics();
      topicBackground.beginFill(0xffffff);

      topicBackground.drawRect(
        -this._config.topicWidth / 2,
        -this._config.topicHeight / 2,
        this._config.topicWidth,
        this._config.topicHeight
      );

      topicBackground.endFill();
      topicBackground.tint = 0xff00c7;

      const topicText = new Text(this._topics[i], {
        fontFamily: 'Raleway',
        fontSize: 94,
        fontWeight: 900,
        align: 'center',
        fontStyle: 'italic',
        padding: 20,
      });

      topicText.anchor.set(0.5);
      topicText.resolution = 2;
      topicContainer.addChild(topicBackground, topicText);
      topicContainer.position.y = (i + 1) * (this._config.topicHeight + this._config.topicGap);
      topicContainer.topic = this._topics[i];

      this.topicsContainer.addChild(topicContainer);
    }

    this._topicsContainerHeight = this.topicsContainer.height;
    this.topicsContainer.y = -this.topicsContainer.height / 2;
    this.addChild(this.topicsContainer);
    this.addChild(mask);
  }

  /**
   * Animates the arrows' contraction
   * @private
   */
  _playArrowAnimation() {
    gsap.to(this._arrows, {
      keyframes: [
        {
          x: (_, target) => {
            return (
              target.startPos
              + this._config.arrowAnimationOffset * target.scale.x
            );
          },
          pixi: {
            tint: 0xfff7b3,
          },
          ease: 'power1.inOut',
          duration: 0.1,
        },
        {
          x: (_, target) => target.startPos,
          pixi: {
            tint: 0xffe500,
          },
          ease: 'power1.inOut',
          duration: 0.15,
        },
      ],
    });
  }

  /**
   * Adds the yellow arrows to the scene
   * @private
   */
  _addArrows() {
    const arrowHeight = 400;
    this._arrows = [];

    this._leftArrow = new Graphics();
    this._leftArrow.beginFill(0xffffff);
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

    this._arrows.push(
      this._leftArrow,
      this._leftArrowSmall,
      this._rightArrow,
      this._rightArrowSmall
    );

    this._arrows.forEach((arrow) => {
      arrow.tint = 0xffe500;
      this.addChild(arrow);
    });
  }
}
