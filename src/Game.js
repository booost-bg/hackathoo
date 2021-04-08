import Setup from './scenes/Setup';
import Intro from './scenes/Intro';
import Splash from './scenes/Splash';
import Topics from './scenes/Topics';
import Countdown from './scenes/Countdown';
import Play from './scenes/Play';
import CountdownStart from './scenes/CountdownStart';
import { Container } from 'pixi.js';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import * as DAT from 'dat.gui';

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
    this.initGUI();
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
   * Dev purposes only
   * Provides convenient scene changing approach for easier debuggin 
   * 
   * To add new scenes to the DropDownList of the dat.gui window 
   * 
   * @method 
   * @return {dat.GUI} 
   * @memberof Game
   */
  initGUI() {
    const gui = new DAT.GUI();
    const sceneSelector = { 'Select scene': '' };

    // Definitions of the elements that will appear in the dat.gui DropDownList
    const dropDownListItems = {
      Intro: 'intro',
      Countdown: 'countdown',
      Play: 'play',
      Setup: 'setup',
      Splash: 'splash',
      Topics: 'topics',
      CountdownStart: 'countdownStart'
    };

    // Scene name - Scene constructor pairs
    const scenes = {
      setup: Setup,
      intro: Intro,
      countdown: Countdown,
      play: Play,
      splash: Splash,
      topics: Topics,
      countdownStart: CountdownStart
    };

    gui.add(sceneSelector, 'Select scene', dropDownListItems)
      .onChange((selectedValue) => {
        this.switchScene(scenes[selectedValue], { scene: selectedValue });
      });

    return gui;
  }
}
