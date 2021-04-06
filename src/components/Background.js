import { Container, Graphics, Texture } from "pixi.js";
import { gsap } from "gsap/all";
import { random } from "../core/utils";

/**
 * Class representing the background and background effects
 */
export default class Background extends Container {
  /**
   * @param {Object} colors - Object containing the colors
   * @param {String} colors.circleColor1 Circle color
   * @param {String} colors.circleColor2 Second circle color
   * @param {String} colors.bgColor1 Leftmost background gradient color
   * @param {String} colors.bgColor2 Rightmost background gradient color
   */
  constructor({
    circleColor1 = '#FF00C7',
    circleColor2 = '#FFE600',
    bgColor1 = '#5200FF',
    bgColor2 = '#A80080',
  } = {}) {
    super();

    this._colors = {
      bgColor1,
      bgColor2,
      circleColor1,
      circleColor2,
    };

    this._config = {
      numberOfCircles: 6,
      minCircleRadius: 15,
      maxCircleRadius: 250,
      circleAnimationDuration: 50,
      colorTransitionDuration: 1,
    };

    this.name = 'background';
    this.sortableChildren = true;
    this._background = this._addGradientBackground();
    this._circles = this._addCircles();

    this._animateCircles();
  }

  /**
   * Smoothly transition the background gradient and circle colors
   * @param {Object} colors Colors object
   * @param {String} colors.circleColor1 Circle color
   * @param {String} colors.circleColor2 Circle color
   * @param {String} colors.bgColor1 Leftmost color of the background gradient
   * @param {String} colors.bgColor2 Rightmost color of the background gradient
   */
  changeColors({ circleColor1, circleColor2, bgColor1, bgColor2 }) {
    if (circleColor1 && circleColor2) {
      this._transitionCircleColors(circleColor1, circleColor2);
    }

    if (bgColor1 && bgColor2) {
      this._transitionBgColor({ from: bgColor1, to: bgColor2 });
    }
  }

  /**
   * Resizes the background to fit the window.
   */
  resize() {
    this._updateBgColor(
      this._colors.bgColor1,
      this._colors.bgColor2,
      this._background
    );

    this._background.x = -window.innerWidth / 2;
    this._background.y = -window.innerHeight / 2;
  }

  /**
   * Animates the circle color change
   * @param {String} color1 Circle color
   * @param {String} color2 Circle color
   * @private
   */
  _transitionCircleColors(color1, color2) {
    gsap.to(
      this._circles.filter((circle) => circle.colorIndex),
      {
        duration: this._config.colorTransitionDuration,
        pixi: {
          tint: color1,
        },
      }
    );

    gsap.to(
      this._circles.filter((circle) => !circle.colorIndex),
      {
        duration: this._config.colorTransitionDuration,
        pixi: {
          tint: color2,
        },
      }
    );
  }

  /**
   * Animates the background gradient color change
   * @param {Object} bgColors { from: "colorStr", to: "colorStr" }
   * @private
   */
  _transitionBgColor(bgColors) {
    gsap.to(this._colors, {
      bgColor1: bgColors.from,
      bgColor2: bgColors.to,
      duration: this._config.colorTransitionDuration,
      onUpdate: () => {
        this._updateBgColor(this._colors.bgColor1, this._colors.bgColor2);
      },
    });
  }

  /**
   * Adds the gradient background
   * @returns {PIXI.Graphics} Background graphics object
   * @private
   */
  _addGradientBackground() {
    const bg = new Graphics();
    this._updateBgColor(this._colors.bgColor1, this._colors.bgColor2, bg);

    bg.x = -window.innerWidth / 2;
    bg.y = -window.innerHeight / 2;

    this.addChild(bg);

    return bg;
  }

  /**
   * Instantly updates the background gradient color
   * @param {String} color1 Leftmost background color
   * @param {String} color2 Rightmost background color
   * @param {PIXI.Graphics} bg Background Graphics object
   * @private
   */
  _updateBgColor(
    color1 = '#FF00C7',
    color2 = '#FFE600',
    bg = this._background
  ) {
    const gradientTexture = this._getGradientTexture(color1, color2);
    bg.clear();
    bg.beginTextureFill(gradientTexture);
    bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
  }

  /**
   * Get a gradient texture from canvas
   * @param {String} fromColor Leftmost gradient color
   * @param {*} toColor Rightmost gradient color
   * @private
   * @returns {PIXI.Texture} Gradient texture
   */
  _getGradientTexture(fromColor, toColor) {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(
      0,
      window.innerHeight,
      window.innerHeight * 2,
      0
    );

    gradient.addColorStop(0, fromColor);
    gradient.addColorStop(0.3, fromColor);
    gradient.addColorStop(1, toColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    return Texture.from(canvas);
  }

  /**
   * Checks the distance between two circles to see if they overlap.
   * @param {PIXI.Graphics} circle1 Circle Graphics object
   * @param {PIXI.Graphics} circle2 Circle Graphics object
   * @private
   * @returns {Boolean}
   */
  _checkCircleOverlap(circle1, circle2) {
    if (
      Math.sqrt(
        (circle2.position.x - circle1.position.x) *
          (circle2.position.x - circle1.position.x) +
          (circle2.position.y - circle1.position.y) *
            (circle2.position.y - circle1.position.y)
      ) <
      circle1.radius + circle2.radius
    ) {
      return true;
    }

    return false;
  }

  /**
   * Adds randomised circles.
   * @private
   * @returns {PIXI.Graphics[]} Circles array
   */
  _addCircles() {
    const circles = [];

    for (let i = 0; i < this._config.numberOfCircles; i++) {
      const circle = new Graphics();

      let overlap;
      do {
        overlap = false;
        const pos = {
          x:
            random(window.innerWidth / 3, window.innerWidth / 2) *
            (Math.random() > 0.5 ? -1 : 1),
          y: random(-window.innerHeight / 2, window.innerHeight / 2),
        };

        circle.position.set(pos.x, pos.y);
        circle.zIndex = 1;
        circle.radius = Math.round(
          random(this._config.minCircleRadius, this._config.maxCircleRadius)
        );

        for (let j = 0; j < circles.length; j++) {
          if (this._checkCircleOverlap(circles[j], circle)) overlap = true;
        }
      } while (overlap);

      let color = i % 2 ? this._colors.circleColor1 : this._colors.circleColor2;
      color = parseInt(color.substr(1, color.length), 16);

      circle.beginFill(0xffffff);
      circle.drawCircle(0, 0, circle.radius);
      circle.tint = color;
      circle.colorIndex = i % 2;

      circles.push(circle);
      this.addChild(circle);
    }

    return circles;
  }

  /**
   * Animates the circles' position up and down.
   * @private
   */
  _animateCircles() {
    this._circles.forEach(async (circle) => {
      const posTop = -window.innerHeight / random(2, 3);
      const posBottom = window.innerHeight / random(2, 3);
      const duration =
        this._config.circleAnimationDuration * (1 + circle.radius / 100);

      await gsap.to(circle, {
        y: posTop,
        duration: duration / 1.5,
      });

      gsap.to(circle, {
        y: posBottom,
        duration,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }
}
