import config from './config';
import Setup from './scenes/Setup';
import Intro from './scenes/Intro';
import FinalCountdown from './scenes/FinalCountdown';
import Splash from './scenes/Splash';
import Play from './scenes/Play';
import Break from './scenes/Break';
import Winners from './scenes/Winners';
import Countdown from './scenes/Countdown';
import { Container } from 'pixi.js';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Server from './components/Server';
import Scene from './scenes/Scene';
import Debug from './components/Debug';
import NotificationManager from './components/NotificationManager';
import Topics from './scenes/Topics';

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
    this._scenes = [];
    this.currentScene = null;

    this._registerScenes();
    this._registerPlugins();
    this._createServer();
    this.initDebug();
    this.initNotifications();
  }

  /**
   * @private
   */
  _registerScenes() {
    this._scenes.push({ scene: Splash, name: 'splash' });
    this._scenes.push({ scene: Intro, name: 'intro' });
    this._scenes.push({ scene: Setup, name: 'setup' });
    this._scenes.push({ scene: Topics, name: 'topics' });
    this._scenes.push({ scene: Countdown, name: 'countdown' });
    this._scenes.push({ scene: Break, name: 'break' });
    this._scenes.push({ scene: FinalCountdown, name: 'finalCountdown' });
    this._scenes.push({ scene: Winners, name: 'winners' });
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
    await this.switchScene({ scene: 'splash' });
    await this.currentScene.finish;

    // this.switchScene(Play, { scene: "play" });
    // this.switchScene(Setup, { scene: 'setup' });
    // this.switchScene(Break, { scene: 'setup' });
    this.switchScene({ scene: 'countdown' });
    // this.switchScene(Intro, { scene: 'intro' });
  }

  /**
   * @param {String} scene
   * @param {Object} data Scene data
   */
  switchScene({ scene, data = {} }) {
    this.removeChild(this.currentScene);
    const constructor = this._getScene(scene);
    this.currentScene = new constructor(data);
    this.currentScene.background = this._background;
    this.currentScene.on(Scene.events.EXIT, ({ to, data }) => {
      this.switchScene({ scene: to, data });
    });
    this.addChild(this.currentScene);
    this.emit(Game.events.SWITCH_SCENE, { scene });

    return this.currentScene.onCreated();
  }

  /**
   * @param {String} name Scene name
   * @returns {Function} constructor
   * @private
   */
  _getScene(name) {
    const { scene } = this._scenes.find((scene) => scene.name === name);

    return scene;
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
    debug.on(Debug.events.SCENE_CHANGED, (scene) => {
      this.switchScene(scene);
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
