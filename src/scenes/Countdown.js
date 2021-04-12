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
    this._startTime = sessionStorage.getItem('currentTime');

    this._progress = sessionStorage.getItem('progress');
    // this._endTime = endTime;
  }

  async onCreated() {
    this.createProgressBar();
    this.createBackground();
    this.createTimer();
    this.createTitle();
    this.createLogo();
    this.createPauseTimerButton('15 min break', 220, 0.1);
    this.createPauseTimerButton('30 min break', 290, 30);
    this.createPauseTimerButton('60 min break', 360, 60);
  }

  static get events() {
    return EVENTS;
  }
  // Number(this._progress - 50) ||
  /**
   * @private
   */
  createProgressBar() {
    console.log(this._progress + ' progressBAR');
    if (this._progress) {
      console.log(this._progress + ' ifa v progressa');
    }
    const pg = new Progressbar({
      initialWidth: 100,
    });

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
    console.log(this._startTime + ' v create timer');
    const timer = new Timer(
      this._startTime || settings.startTime,
      settings.endTime
    );
    timer.y = -75;

    this.timer = timer;
    // this.timer.distance(this._startTime);
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
      const { right } = this._pg.getBounds();
      window.sessionStorage.setItem('currentTime', this.timer.getProgress());
      window.sessionStorage.setItem('progress', Math.floor(right));
      this.pause();
      this.emit(Scene.events.EXIT, { to: 'break', data: { duration } });
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
    // this.emit(Scene.events.COUNTDOWN_END);
    // this.emit(Scene.events.EXIT, { to: 'finalCountdown' });
  }
}
