import Scene from './Scene';
import Timer from '../components/Timer';
import Button from '../components/Button';
import CountdownBase from '../components/CountdownBase';
import RulesCriteria from "../components/RulesCriteria";

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class Countdown extends CountdownBase {
  constructor() {
    super();

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
  getProgress() {
    const progress = JSON.parse(sessionStorage.getItem("progress"));
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
    button.on("click", () => {
      this.saveProgress();
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
  saveProgress() {
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
  finishScene() {
    sessionStorage.removeItem("progress");
    this.timer.clearInterval();
    this.emit(Scene.events.EXIT, {
      to: "finalCountdown",
    });
  }
}
