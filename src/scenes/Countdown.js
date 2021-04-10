import Scene from './Scene';
import Timer from '../components/Timer';
import Title from '../components/Title';
import HackathonLogo from '../components/HackathonLogo';
import Button from '../components/Button';
import Background from '../components/Background';
import Progressbar from '../components/Progressbar';

const EVENTS = {
  BREAK_START: 'break_start',
  COUNTDOWN_END: 'countdown_end',
};

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class Countdown extends Scene {
  async onCreated() {
    this.createProgressBar();
    this.createBackground();
    this.createTimer();
    this.createTitle();
    this.createLogo();
    this.createPauseTimerButton('15 min break', 220, 15);
    this.createPauseTimerButton('30 min break', 290, 30);
    this.createPauseTimerButton('60 min break', 360, 60);
  }

  static get events() {
    return EVENTS;
  }

  /**
   * @private
   */
  createProgressBar() {
    const pg = new Progressbar({ initialWidth: 100 });

    pg.y = -window.innerHeight / 2;
    pg.x = -window.innerWidth / 2;

    this._pg = pg;
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
    this._background.addChild(this._pg);
    this.addChild(this._background);
  }

  /**
   * Renders the timer for the scene.
   * @method
   * @private
   */
  createTimer() {
    const settings = JSON.parse(localStorage.getItem('hackathonSettings'));
    const timer = new Timer(settings.startTime, settings.endTime);
    timer.y = -75;
    this.timer = timer;
    this.timer.on(Timer.events.LAST_TEN_SECONDS, () => {
      this.timer.clearInterval();
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
    const endTime = JSON.parse(localStorage.getItem('hackathonSettings'))
      .endTime;
    const parsedEndTime = endTime.replace(/-|T/g, '/');

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
      this.emit(Countdown.events.BREAK_START, { duration });
      this.pause();
    });

    this.addChild(button);
  }

  /**
   * Pause scene
   * @method
   * @private
   */
  pause() {
    this.timer.pause();
    this._pg.pause();
  }

  /**
   * Continue scene after pause
   * @method
   * @public
   */
  continue() {
    this.timer.play();
    this._pg.play();
  }

  /**
   * @method
   * @private
   */
  startProgressBar() {
    this._pg.start(this.timer.totalTime);
  }

  /**
   * Emits a finish event
   * @method
   * @private
   */
  finishScene() {
    this.emit(Countdown.events.COUNTDOWN_END);
  }
}
