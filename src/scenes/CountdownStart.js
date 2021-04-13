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
    this.createCriteriaRulesButton('CRITERIA', 190, 'criteriaButton');
    this.createCriteriaRulesButton('RULES', 122, 'rulesButton');
  }

  /**
   * @private
   */
  createProgressBar() {
    const progressBar = new Progressbar({ initialWidth: 100 });

    progressBar.y = -window.innerHeight / 2;
    progressBar.x = -window.innerWidth / 2;

    this._progressBar = progressBar;
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

  createCriteriaRulesButton(text, y, key) {
    const button = new Button({
      width: 172,
      height: 55,
      text,
    });

    button.key = key;
    button.pivot.x = window.innerWidth / 2 - 100;
    button.y = window.innerHeight / 2 - y;
    button.on('pointerdown', () => {
      this.emit(CountdownStart.events.BUTTON_CLICKED, button.key);
    });

    this.addChild(button);
  }

  /**
   * @private
   */
  startProgressBar() {
    this._progressBar.start(this.timer.totalTime);
  }

  static get events() {
    return {
      BUTTON_CLICKED: 'button_clicked',
    };
  }
}
