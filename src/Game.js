import config from './config';
import Setup from './scenes/Setup';
import Intro from './scenes/Intro';
import FinalCountdown from './scenes/FinalCountdown';
import Splash from './scenes/Splash';
import Break from './scenes/Break';
import Winners from './scenes/Winners';
import Countdown from './scenes/Countdown';
import CountdownStart from './scenes/CountdownStart';
import { Container } from 'pixi.js';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Server from './components/Server';
import Scene from './scenes/Scene';
import Debug from './components/Debug';
import NotificationManager from './components/NotificationManager';
import Topics from './scenes/Topics';
import Background from './components/Background';
import Code from './scenes/Code';
import TimerEnd from './scenes/TimerEnd';
import dayjs from 'dayjs';

/**
 * Main game stage, manages scenes/levels.
 
 * @extends {PIXI.Container}
 */
export default class Game extends Container {
  static get events() {
    return {
      SWITCH_SCENE: 'switch_scene',
    };
  }

  constructor() {
    super();

    this.sortableChildren = true;

    this._config = config;
    this._server = null;
    this._scenes = [];
    this._progressBar = null;
    this._background = null;
    this.currentScene = null;

    this._createBackground();
    this._registerScenes();
    this._registerPlugins();
    this._createServer();
    this.initDebug();
    // this.initNotifications();
  }

  /**
   * @private
   */
  _createBackground() {
    this._background = new Background();
    this.addChild(this._background);
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
    this._scenes.push({ scene: CountdownStart, name: 'countdownStart' });
    this._scenes.push({ scene: Break, name: 'break' });
    this._scenes.push({ scene: FinalCountdown, name: 'finalCountdown' });
    this._scenes.push({ scene: Winners, name: 'winners' });
    this._scenes.push({ scene: Code, name: 'code' });
    this._scenes.push({ scene: TimerEnd, name: 'timerEnd' });
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
    this.switchScene({ scene: 'intro' });
  }

  /**
   * @param {String} scene
   * @param {Object} data Scene data
   */
  async switchScene({ scene }) {
    this._removeProgressBar();
    await this._fadeOut();

    this.removeChild(this.currentScene);

    const constructor = this._getScene(scene);
    this.currentScene = new constructor(this.apiData);
    this.currentScene.alpha = 0;

    this.currentScene.on(Scene.events.EXIT, ({ to }) => {
      this.switchScene({ scene: to });
    });

    this.addChild(this.currentScene);
    this.emit(Game.events.SWITCH_SCENE, { scene });
    this.eventListeners();

    await this.currentScene.onCreated();

    this._addProgressBar();
    await this._fadeIn();
  }

  eventListeners() {

    this.currentScene.on(
      Setup.events.CHANGE_COLOR,
      ({ bgColor1, bgColor2, circleColor1, circleColor2 }) => {
        this._background.changeColors({bgColor1, bgColor2, circleColor1, circleColor2});
      }
    );

    this.currentScene.once(Setup.events.SUBMIT, async (hackathonSettings) => {
      this.apiData = await this._server.create(hackathonSettings);
      this.currentScene.fadeOut();
      this.switchScene({ scene: 'code' });
    });

    this.currentScene.on(Intro.events.JOIN_SUBMIT, async ({ code }) => {
      try {
        this.apiData = await this._server.status(code);
        this.currentScene.join.remove();
      } catch (e) {
        this.currentScene.join.handleInvalidCode();

        return;
      }

      const currentTime = dayjs();
      const parsedStartTime = dayjs(this.apiData.hackathonSettings.startTime);
      const parsedEndTime = dayjs(this.apiData.hackathonSettings.endTime);

      if (currentTime < parsedStartTime) {
        this.switchScene({ scene: 'countdownStart' });
      } else if (parsedEndTime - currentTime <= 10000 && parsedEndTime - currentTime > 0) {
        this.switchScene({ scene: 'finalCountdown' });
      } else if (
        currentTime > parsedStartTime 
        && currentTime < parsedEndTime
      ) {
        this.switchScene({ scene: 'countdown' });
      } else if (currentTime > parsedEndTime && !this.apiData.winners) {
        this.switchScene({ scene: 'timerEnd' });
      } else if (currentTime > parsedEndTime && this.apiData.winners) {
        this.switchScene({scene: 'winners'});
      }

      const { mainColor, accentColor, fx1Color, fx2Color } = this.apiData.hackathonSettings;
      this._background.changeColors({
        bgColor1: mainColor,
        bgColor2: accentColor,
        circleColor1: fx1Color,
        circleColor2: fx2Color,
      });
    });
    
  }

  /**
   * Scene fade out animation
   * @private
   */
  async _fadeOut() {
    await gsap.to(this.currentScene, {
      pixi: {
        scale: 0.9,
        alpha: 0,
      },
      duration: 0.8,
      ease: 'Circ.easeOut',
    });
  }

  /**
   * Scene fade in animation
   * @private
   */
  async _fadeIn() {
    await gsap.to(this.currentScene, {
      pixi: {
        alpha: 1,
      },
      duration: 0.8,
    });
  }

  /**
   * Add progressbar to scene background
   * @private
   */
  _addProgressBar() {
    if (this.currentScene._progressBar) {
      this._progressBar = this.currentScene._progressBar;
      this._progressBar.alpha = 0;
      this._background.addChild(this.currentScene._progressBar);

      gsap.to(this._progressBar, {
        pixi: {
          alpha: 1,
        },
        duration: 0.8,
      });
    }
  }

  /**
   * Remove progressbar from scene background
   * @private
   */
  _removeProgressBar() {
    if (this._progressBar) {
      gsap.to(this._progressBar, {
        pixi: {
          alpha: 0,
        },
        duration: 0.8,
        ease: 'Circ.easeOut',
        onComplete: () => {
          this._background.removeChild(this._progressBar);
          this._progressBar = null;
        },
      });
    }
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
