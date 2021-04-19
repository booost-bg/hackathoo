import Scene from './Scene';
import Timer from '../components/Timer';
import Button from '../components/Button';
import RulesCriteria from "../components/RulesCriteria";
import CountdownBase from './CountdownBase';

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class Countdown extends CountdownBase {
  constructor() {
    super();

    this.onCreated().then(() => {
      this._getProgress();
      this._createTimer();
      this._createPauseTimerButton('15 min break', 220, 15);
      this._createPauseTimerButton('30 min break', 290, 30);
      this._createPauseTimerButton('60 min break', 360, 60);
    });
  }

  /**
   * Initializes the rules & criteria component
   * @method
   * @private
   */
  _initRulesCriteria() {
    const rulesCriteria = new RulesCriteria();
    this.addChild(rulesCriteria);
  }
  /**
   * Get progress, if any, from session storage.
   * @private
   */
  _getProgress() {
    const progress = JSON.parse(sessionStorage.getItem('progress'));
    if (progress) {
      this._startTime = progress.startTime;
      this._progressBarInitialWidth = progress.barPosition;
    }
  }

  /**
   * Renders the timer for the scene.
   * @method
   * @private
   */
  _createTimer() {
    const timer = new Timer(this._startTime, this._endTime);
    timer.y = -75;

    this.timer = timer;
    this.timer.on(Timer.events.LAST_TEN_SECONDS, () => {
      this._finishScene();
    });
    this.addChild(this.timer);
    this._startProgressBar();
  }

  /**
   * Renders the scene's button
   * @param {String} text button text
   * @param {Number} y button y coordinate value
   * @param {Number} duration pause timer duration
   * @method
   * @private
   */
  _createPauseTimerButton(text, y, duration) {
    const button = new Button({
      width: 300,
      height: 50,
      text,
    });
    button.pivot.x = button.width / 2;
    button.y = y;
    button.on('click', () => {
      this._saveProgress();
      this.timer.clearInterval();
      this.emit(Scene.events.EXIT, {
        to: "break",
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
  _saveProgress() {
    const progress = {
      startTime: this.timer.getProgress(),
      barPosition: this._progressBar.getProgress(),
    };
    sessionStorage.setItem("progress", JSON.stringify(progress));
  }

  /**
   * Emits a finish event
   * @method
   * @private
   */
  _finishScene() {
    sessionStorage.removeItem('progress');
    this.timer.clearInterval();
    this.emit(Scene.events.EXIT, {
      to: "finalCountdown",
    });
  }
}
