import Title from '../components/Title';
import HackathonLogo from '../components/HackathonLogo';
import Background from '../components/Background';
import Progressbar from '../components/Progressbar';
import Scene from '../scenes/Scene';
import dayjs from 'dayjs';

export default class CountdownBase extends Scene {
  async onCreated() {

    const { startTime, endTime, text } = JSON.parse(
      localStorage.getItem('hackathonSettings')
    );

    /**
     * @type {Date} - The start date of the Hackathon
     * @private
     */
    this._startTime = startTime;

    /**
     * @type {Date} - The end date of the Hackathon
     * @private
     */
    this._endTime = endTime;

    /**
     * @type {String} - The name of the Hackathon
     * @private
     */
    this._text = text;

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

    this._createProgressBar();
    this._createBackground();
    this._createTitle();
    this._createLogo();
  }

  /**
   * Initializes Progressbar 
  * @method 
  * @private
  */
  _createProgressBar() {
    const progressBar = new Progressbar({ initialWidth: 100 });

    progressBar.y = -window.innerHeight / 2;
    progressBar.x = -window.innerWidth / 2;

    this._progressBar = progressBar;
  }

  /**
   * Renders background
   * @method
   * @private
   */
  _createBackground() {
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
   * Renders the scene's title/
   * @method
   * @private
   */
  _createTitle() {
    const parsedStartTime = dayjs(this.startTime).format('YYYY/MM/DD HH:MM');

    const title = new Title(`Starts at ${parsedStartTime}`);

    title.y = 150;
    this.addChild(title);
  }

  /**
   * Renders the hackathon's logo
   * @method
   * @private
   */
  _createLogo() {
    const text = JSON.parse(
      localStorage.getItem('hackathonSettings')
    ).hackathonName.toUpperCase();
    const logo = new HackathonLogo(text);
    this.addChild(logo);
  }

  /**
  * Renders Progressbar
  * @method
  * @private
  */
  _startProgressBar() {
    this._progressBar.start(this.timer.totalTime);
  }
}