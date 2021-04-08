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
export default class CountdownStart extends Scene {
  async onCreated() {
    this.createProgressBar();
    this.createBackground();
    this.createTimer();
    this.createTitle();
    this.createLogo();
    this.createCriteriaRulesButton('CRITERIA', 190);
    this.createCriteriaRulesButton('RULES', 122);
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
    const timer = new Timer(true);
    timer.y = -75;
    this.timer = timer;
    this.addChild(this.timer);
    this.startProgressBar();
  }

  /**
   * Renders the scene's title/
   * @method
   * @private
   */
  createTitle() {
    const startTime = JSON.parse(localStorage.getItem('hackathonSettings'))
      .startTime;
    const parsedStartTime = startTime.replace(/-|T/g, '/');

    const title = new Title(`Starts at ${parsedStartTime}`);

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

  createCriteriaRulesButton(text, y) {
    const that = this;
    const button = new Button({
      width: 172,
      height: 55,
      text,
    });

    button.pivot.x = window.innerWidth / 2 - 100;
    button.y = window.innerHeight / 2 - y;
    button.on('pointerdown', () => {
      that.emit(text === 'CRITERIA' ? CountdownStart.events.CRITERIA_CLICKED : CountdownStart.events.RULES_CLICKED);
    });
    this.addChild(button);
  }

  /**
   * @private
   */
  startProgressBar() {
    this._pg.start(this.timer.totalTime);
  }

  static get events() {
    return {
      CRITERIA_CLICKED: 'criteria_clicked',
      RULES_CLICKED: 'rules_clicked'
    };
  }
}
