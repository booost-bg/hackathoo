import Scene from './Scene';
import Timer from '../components/Timer';
import Title from '../components/Title';
import HackathonLogo from '../components/HackathonLogo';
import Background from '../components/Background';
import Progressbar from '../components/Progressbar';
import dayjs from 'dayjs';

/**
 * Represents the break scene of the app.
 * @class
 */
export default class Break extends Scene {
  /**
   * @param {Number} duration The break duration value
   */
  constructor({ duration }) {
    super();
    this._duration = duration;
    /**
     * @type {PIXI.Container}
     * @private
     */
    this._timer = null;
    /**
     * @type {PIXI.Container}
     * @private
     */
    this._progressBar = null;
    /**
     * @type {Date}
     * @private
     */
    this._endTime = null;
  }

  async onCreated() {
    this._createProgressBar();
    this._createBackground();
    this._createTimer();
    this._createTitle();
    this._createLogo();
  }

  /**
   * @private
   */
  _createProgressBar() {
    const pg = new Progressbar({ initialWidth: 100 });

    pg.y = -window.innerHeight / 2;
    pg.x = -window.innerWidth / 2;

    this._progressBar = pg;
  }

  /**
   * @private
   */
  _createBackground() {
    const background = new Background({
      bgColor1: '#014641',
      bgColor2: '#014641',
      circleColor1: '#FFE600',
      circleColor2: '#FFE600',
    });

    background.addChild(this._progressBar);
    this.addChild(background);
  }

  /**
   * Renders the timer for the scene.
   * @private
   */
  _createTimer() {
    const currentTime = dayjs();
    this._endTime = currentTime.add(this._duration, 'minute');

    const timer = new Timer(currentTime, this._endTime);

    timer.y = -75;
    this._timer = timer;
    this._timer.on(Timer.events.TIMER_END, () => this._finishScene());

    this.addChild(this._timer);
    this._startProgressBar();
  }

  /**
   * Renders the scene's title/
   * @private
   */
  _createTitle() {
    const title = new Title(`Ends at ${this._endTime.format('H:mm')} `);

    title.y = 150;
    this.addChild(title);
  }

  /**
   * Renders the hackathon's logo
   * @private
   */
  _createLogo() {
    const logo = new HackathonLogo('BREAK TIME');

    this.addChild(logo);
  }

  /**
   * @private
   */
  _startProgressBar() {
    this._progressBar.start(this._timer.totalTime);
  }

  /**
   * Emits a finish event
   * @private
   */
  _finishScene() {
    this.emit(Scene.events.EXIT, {
      to: 'countdown',
    });
  }
}
