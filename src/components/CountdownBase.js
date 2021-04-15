import Title from '../components/Title';
import HackathonLogo from '../components/HackathonLogo';
import Background from '../components/Background';
import Progressbar from '../components/Progressbar';
import Scene from '../scenes/Scene';

export default class CountdownBase extends Scene {
  async onCreated() {

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

    this.createProgressBar();
    this.createBackground();
    this.createTitle();
    this.createLogo();
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

  /**
 * @private
 */
  startProgressBar() {
    this._progressBar.start(this.timer.totalTime);
  }
}