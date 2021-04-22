import Title from '../components/Title';
import HackathonLogo from '../components/HackathonLogo';
import Background from '../components/Background';
import Progressbar from '../components/Progressbar';
import Scene from './Scene';
import dayjs from 'dayjs';
import Button from '../components/Button';
import Panel from '../components/Panel';

export default class CountdownBase extends Scene {

  constructor(apiData) {
    super();
    this.apiData = apiData;
  }

  async onCreated() {

    const {startTime, endTime, hackathonName} = this.apiData.hackathonSettings;
    
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
    this._text = hackathonName;

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
    this._createRulesButton();
    this._createCriteriaButton();
  }

  /**
   * Creates the rules button.
   * @method
   * @private
   */
  _createRulesButton() {
    const rulesButton = new Button({text: 'RULES', fontSize: 24, width: 160, height: 50, curveSize: 10});
    rulesButton.pivot.x = 160 / 2;
    rulesButton.pivot.y = 50 / 2;
    rulesButton.x = -800;
    rulesButton.y = 370;
    this.addChild(rulesButton);
    rulesButton.on('click', () => {
      this._rulesButtonHandler();
    });
  }

  /**
   * Creates the criteria button.
   * @method
   * @private
   */
  _createCriteriaButton() {
    const criteriaButton = new Button({text: 'CRITERIA', fontSize: 24, width: 160, height: 50, curveSize: 10});
    criteriaButton.pivot.x = 160 / 2;
    criteriaButton.pivot.y = 50 / 2;
    criteriaButton.x = -800;
    criteriaButton.y = 300;
    this.addChild(criteriaButton);
    criteriaButton.on('click', () => {
      this._criteriaButtonHandler();
    });
  }

  /**
   * Handles rules button click.
   * @method
   * @private
   */
  _rulesButtonHandler() {
    this.panel = new Panel('RULES', 'content');
    this.panel.init();
  };

  /**
   * Handles criteria button click.
   * @method
   * @private
   */
  _criteriaButtonHandler() {
    this.panel = new Panel('CRITERIA', 'content');
    this.panel.init();
  };

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
    const text = this.apiData.hackathonSettings.hackathonName.toUpperCase();
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