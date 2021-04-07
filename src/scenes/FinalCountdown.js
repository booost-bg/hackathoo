import Assets from '../core/AssetManager';
import Scene from './Scene';
import Background from '../components/Background';
import { Model, Light, LightingEnvironment } from 'pixi3d';
import gsap from 'gsap/gsap-core';
import HackathonLogo from '../components/HackathonLogo';

/**
 * Class representing the 3D countdown scene
 */
export default class FinalCountdown extends Scene {
  constructor(opts = { hackathonName: 'HACKATHON' }) {
    super();

    this._opts = opts;
    this._models = Assets.models;

    this._init();
  }
  
  /**
   * Events getter
   */
  static get events() {
    return {
      finishScene: 'finishScene',
    };
  }

  /**
   * @private
   */
  _init() {
    this._addBackground();
    this._addModels();
    this._addLights();
    this._addHackathonName();
  }

  /**
   * Add the 3D digit models
   * @private
   */
  _addModels() {
    const digitModels = [];

    for (let i = 10; i >= 0; i--) {
      const digit = Model.from(this._models[`${i}`].gltf);

      digit.scale.set(100);
      digit.position.z = 7;
      digit.position.y = -0.2;
      digitModels.push(digit);

      this.addChild(digit);
    }

    this._animateDigits(digitModels);
  }

  /**
   * Starts the countdown animation
   * @private
   * @param {Array} digits 3D model array
   */
  async _animateDigits(digits) {
    const delay = (time) => new Promise((res) => setTimeout(() => res(), time));

    for (const digit of digits) {
      gsap.timeline()
        .to(digit, {
          z: 1,
          ease: 'back',
          duration: 1
        })
        .to(digit, {
          pixi: {
            z: -5,
            scale: 0,
          },
          onComplete: () => {
            this.removeChild(digit);
          } 
        });

      await delay(1000);
    }

    this.emit(FinalCountdown.events.finishScene);
  }

  /**
   * Adds the lights to the scene
   * @private
   */
  _addLights() {
    const pointLight1 = Object.assign(new Light(), { 
      type: 'point', x: -0.5, y: 0, z: 6, range: 200, intensity: 100
    });

    const pointLight2 = Object.assign(new Light(), { 
      type: 'point', x: 1, y: 0, z: 7, range: 200, intensity: 30
    });

    LightingEnvironment.main.lights.push(pointLight1, pointLight2);
  }

  /**
   * Adds the hackathon title to the scene
   * @private
   */
  _addHackathonName() {
    const name = new HackathonLogo(this._opts.hackathonName);

    this.addChild(name);
  }

  /**
   * Adds the background fx to the scene
   * @private
   */
  _addBackground() {
    const background = new Background();

    this.addChild(background);
  }
}