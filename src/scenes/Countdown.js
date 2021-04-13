import Scene from './Scene';
import Timer from '../components/Timer';
import Title from '../components/Title';
import HackathonLogo from '../components/HackathonLogo';
import Button from '../components/Button';
import Background from '../components/Background';
import Progressbar from '../components/Progressbar';

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class Countdown extends Scene {
  constructor() {
    super();
    const { startTime, endTime } = JSON.parse(
      localStorage.getItem('hackathonSettings')
    );

    /**
     * @type {Date}
     * @private
     */
    this._startTime = startTime;
    /**
     * @type {Date}
     * @private
     */
    this._endTime = endTime;
    /**
     * @type {Number}
     * @private
     */
    this._progressBarInitialWidth = 100;

    /**
     * @type {PIXI.Container}
     * @private
     */
    this._progressBar = null;
    /**
     * @type {PIXI.Container}
     * @private
     */
    this._background = null;
    /**
     * @type {PIXI.Container}
     * @private
     */
    this.timer = null;
  }

  async onCreated() {
    this.getProgress();
    this.createProgressBar();
    this.createBackground();
    this.createTimer();
    this.createTitle();
    this.createLogo();
    this.createPauseTimerButton('15 min break', 220, 15);
    this.createPauseTimerButton('30 min break', 290, 30);
    this.createPauseTimerButton('60 min break', 360, 60);
  }

  /**
   * Get progress, if any, from session storage.
   * @private
   */
  getProgress() {
    const progress = JSON.parse(sessionStorage.getItem('progress'));
    if (progress) {
      this._startTime = progress.startTime;
      this._progressBarInitialWidth = progress.barPosition;
    }
  }

  /**
   * @private
   */
  createProgressBar() {
    const pg = new Progressbar({
      initialWidth: this._progressBarInitialWidth,
    });

    pg.y = -window.innerHeight / 2;
    pg.x = -window.innerWidth / 2;

    this._progressBar = pg;
  }

  /**
   * @private
   */
  createBackground() {
    const background = new Background({
      bgColor1: '#0C59EB',
      bgColor2: '#0C59EB',
      circleColor1: '#FFE600',
      circleColor2: '#FFE600',
    });

    this._background = background;
    this._background.addChild(this._progressBar);
    this.addChild(this._background);
  }

  /**
   * Renders the timer for the scene.
   * @method
   * @private
   */
  createTimer() {
    const timer = new Timer(this._startTime, this._endTime);
    timer.y = -75;

    this.timer = timer;
    this.timer.on(Timer.events.LAST_TEN_SECONDS, () => {
      this.finishScene();
    });
    this.addChild(this.timer);
    this.startProgressBar();
  }

  /**
   * Renders the scene's title/
   * @method
   * @private
   */
  createTitle() {
    const parsedEndTime = this._endTime.replace(/-|T/g, '/');

    const title = new Title(`Ends at ${parsedEndTime}`);
    title.y = 150;
    this.addChild(title);
  }

  /**
   * Renders the hackathon's logo
   * @method
   * @private
   */
  createLogo() {
    const text = JSON.parse(
      localStorage.getItem('hackathonSettings')
    ).hackathonName.toUpperCase();
    const logo = new HackathonLogo(text);
    this.addChild(logo);
  }

  /**
   * Renders the scene's button
   * @param {String} text button text
   * @param {Number} y button y coordinate value
   * @param {Number} duration pause timer duration
   * @method
   * @private
   */
  createPauseTimerButton(text, y, duration) {
    const button = new Button({
      width: 300,
      height: 50,
      text,
    });
    button.pivot.x = button.width / 2;
    button.y = y;
    button.on('click', () => {
      this.saveProgress();
      this.timer.clearInterval();
      this.emit(Scene.events.EXIT, {
        to: 'break',
        data: {
          duration,
        },
      });
    });

    this.addChild(button);
  }

  /**
   * Save progress to session storage
   * @private
   */
  saveProgress() {
    const progress = {
      startTime: this.timer.getProgress(),
      barPosition: this._progressBar.getProgress(),
    };
    sessionStorage.setItem('progress', JSON.stringify(progress));
  }

  /**
   * @method
   * @private
   */
  startProgressBar() {
    this._progressBar.start(this.timer.totalTime);
  }

  /**
   * Emits a finish event
   * @method
   * @private
   */
  finishScene() {
    sessionStorage.removeItem('progress');
    this.timer.clearInterval();
    this.emit(Scene.events.EXIT, { to: 'finalCountdown' });
  }
}
