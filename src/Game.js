
import Setup from './scenes/Setup';
import Intro from './scenes/Intro';
import Splash from './scenes/Splash';
import { Container } from 'pixi.js';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Debug from '../src/components/Debug';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {
  static get events() {
    return {
      SWITCH_SCENE: 'switch_scene',
    };
  }

  /**
   * @param {PIXI.Sprite} background
   */
  constructor({ background } = {}) {
    super();

    this._background = background;
    this.currentScene = null;
    this._registerPlugins();
    this.initDebug();
  }

  /**
   * Register global plugins here
   * @private
   */
  _registerPlugins() {
    gsap.registerPlugin(MotionPathPlugin);
    // Prevent timeline pause when tab is not on focus
    gsap.ticker.lagSmoothing(false);
  }

  async start() {
    await this.switchScene(Splash, { scene: 'splash' });
    await this.currentScene.finish;

    // this.switchScene(Play, { scene: "play" });
    this.switchScene(Setup, { scene: 'setup' });
    // this.switchScene(Intro, { scene: 'intro' });
  }

  /**
   * @param {Function} constructor
   * @param {String} scene
   */
  switchScene(constructor, scene) {
    this.removeChild(this.currentScene);
    this.currentScene = new constructor();
    this.currentScene.background = this._background;
    this.addChild(this.currentScene);

    this.emit(Game.events.SWITCH_SCENE, { scene });

    return this.currentScene.onCreated();
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    if (this.currentScene === null) return;

    this.currentScene.onResize(width, height);
  }


  /**
   * Method called to initialize an instance of the Debug class that handles the dat.gui scene change in the app.
   *
   * @memberof Game
   */
  initDebug() {
    const debug = new Debug();
    debug.on(Debug.events.SCENE_CHANGED, (constructor, scene) => {
      this.switchScene(constructor, scene);
    });
  }

}
