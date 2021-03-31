import { Container, Graphics, Texture } from 'pixi.js';
import { gsap } from 'gsap/all';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { random } from '../core/utils';

export default class Background extends Container {
  constructor(
    circleColor1 = '#FF00C7', 
    circleColor2 = '#FFE600', 
    bgColor1 = '#5200FF', 
    bgColor2 = '#A80080'
  ) {
    super();

    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(window.PIXI);

    this._config = {
      bgColor1,
      bgColor2,
      circleColor1,
      circleColor2,
      numberOfCircles: 6
    };

    this.name = 'background';
    this._background = this._addGradientBackground();
    this._circles = this._addCircles();

    this._animateCircles();
  }

  changeColors(circleColor1, circleColor2, bgFrom, bgTo) {
    if (circleColor1 && circleColor2) this._transitionCircleColors(circleColor1, circleColor2);
    if (bgFrom) this._transitionBgColor({ from: bgFrom, to: (bgTo ? bgTo : bgFrom) });
  }

  _transitionCircleColors(color1, color2) {
    gsap.to(this._circles.filter((circle) => circle.colorIndex), {
      duration: 1,
      pixi: {
        tint: color1,
        skewX: 2
      }
    });

    gsap.to(this._circles.filter((circle) => !circle.colorIndex), {
      duration: 1,
      pixi: {
        tint: color2,
        skewX: 2
      }
    });
  }
  
  _transitionBgColor(bgColors) {
    gsap.to(this._config, {
      bgColor1: bgColors.from,
      bgColor2: bgColors.to,
      duration: 1,
      onUpdate: () => {
        this._updateBgColor(this._config.bgColor1, this._config.bgColor2);
      }
    });
  }

  _init() {
    this._addGradientBackground();
    this._addCircles();
  }

  _addGradientBackground() {
    const bg = new Graphics();
    this._updateBgColor(this._config.bgColor1, this._config.bgColor2, bg);

    bg.x = -window.innerWidth / 2;
    bg.y = -window.innerHeight / 2;

    this.addChild(bg);

    return bg;
  }

  _updateBgColor(color1 = 0xFF00C7, color2 = 0xFFE600, bg = this._background) {
    const gradientTexture = this._getGradientTexture(color1, color2);
    bg.clear();
    bg.beginTextureFill(gradientTexture);
    bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
  }

  _getGradientTexture(fromColor, toColor) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, window.innerHeight, window.innerHeight * 2, 0);

    gradient.addColorStop(0, fromColor);
    gradient.addColorStop(0.3, fromColor);
    gradient.addColorStop(1, toColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    return Texture.from(canvas);
  }

  _addCircles() {
    const circles = [];
    const minRadius = 15;
    const maxRadius = 250;

    for (let i = 0; i < this._config.numberOfCircles; i++) {
      const circle = new Graphics();
      const radius = Math.round(random(minRadius, maxRadius));
      const pos = {
        x: random(window.innerWidth / 3, window.innerWidth / 2) * (Math.random() > 0.5 ? -1 : 1),
        y: random(-window.innerHeight / 2, window.innerHeight / 2),
      };
      let color = i % 2 ? this._config.circleColor1 : this._config.circleColor2;
      color = parseInt(color.substr(1, color.length), 16);

      circle.beginFill(0xFFFFFF);
      circle.drawCircle(0, 0, radius);
      circle.radius = radius;
      circle.tint = color;
      circle.colorIndex = i % 2;
      circle.position.set(pos.x, pos.y);

      circles.push(circle);
      this.addChild(circle);
    }

    return circles;
  }

  _animateCircles() {
    this._circles.forEach(async (circle) => {
      const posTop = -window.innerHeight / random(2, 3);
      const posBottom = window.innerHeight / random(2, 3);
      const duration = 8 * (1 + circle.radius / 100);

      await gsap.to(circle, {
        y: posTop,
        duration,
      });

      gsap.to(circle, {
        y: posBottom,
        duration,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  }
}