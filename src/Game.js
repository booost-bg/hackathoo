import config from './config';
import Setup from './scenes/Setup';
import Intro from './scenes/Intro';
import FinalCountdown from './scenes/FinalCountdown';
import Splash from './scenes/Splash';
import Play from './scenes/Play';
import Break from './scenes/Break';
import Countdown from './scenes/Countdown';
import { Container } from 'pixi.js';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Server from './components/Server';
import Debug from '../src/components/Debug';
import NotificationManager from '../src/components/NotificationManager';

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

    this.sortableChildren = true;

    this._config = config;
    this._server = null;
    this._background = background;
    this.currentScene = null;

    this._registerPlugins();
    this._createServer();
    this.initDebug();
    this.initNotifications();
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

  /**
   * @private
   */
  _createServer() {
    const server = new Server(this._config.server);

    this._server = server;
  }

  async start() {
    this._addEventListeners();

    await this.switchScene(Splash, { scene: 'splash' });
    await this.currentScene.finish;

    // this.switchScene(Play, { scene: "play" });
    // this.switchScene(Setup, { scene: 'setup' });
    // this.switchScene(Break, { scene: 'setup' });
    this.switchScene(Countdown, { scene: 'setup' });
    // this.switchScene(Intro, { scene: 'intro' });
  }

  /**
   * @param {Function} constructor
   * @param {String} scene
   * @param {Object} data Scene data
   * @param {Boolean} preserveScene Preserve or delete current scene
   */
  switchScene(
    constructor,
    { scene = '', data = {}, preserveScene = false } = {}
  ) {
    if (preserveScene) {
      this._previousScene = this.currentScene;
    } else {
      this.removeChild(this.currentScene);
    }
    this.currentScene = new constructor(data);
    this.currentScene.background = this._background;
    this.addChild(this.currentScene);
    this.emit(Game.events.SWITCH_SCENE, { scene });

    return this.currentScene.onCreated();
  }

  /**
   * @private
   */
  _addEventListeners() {
    this.on(Game.events.SWITCH_SCENE, () => {
      this.currentScene.on(Countdown.events.BREAK_START, (data) => {
        this.switchScene(Break, { scene: 'break', data, preserveScene: true });
        this._previousScene.visible = false;
      });

      this.currentScene.on(Break.events.BREAK_END, () => {
        this._previousScene.visible = true;
        this.currentScene = this._previousScene;
        this.currentScene.continue();
      });

      this.currentScene.on(Countdown.events.COUNTDOWN_END, () => {
        this.switchScene(FinalCountdown, { scene: 'finalCountdown' });
      });
    });
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

  /**
   * Adds notification manager to the Game.
   * Use the notification manager to display notifications on all scenes
   *
   * @memberof Game
   */
  initNotifications() {
    const notificationManager = new NotificationManager();
    this.notificationManager = notificationManager;
    this.notificationManager.zIndex = 100;
    this.notificationManager.pivot.x = window.innerWidth / 2;
    this.notificationManager.y = -window.innerHeight / 2 + 80;

    this.addChild(notificationManager);
  }
}
