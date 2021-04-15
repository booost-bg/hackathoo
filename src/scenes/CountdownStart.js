import Button from '../components/Button';
import CountdownBase from '../components/CountdownBase';
import Timer from '../components/Timer';
import dayjs from 'dayjs';

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class CountdownStart extends CountdownBase {
  constructor() {
    super();
    this.onCreated().then(() => {
      this.createTimer();
      this.createCriteriaRulesButton('CRITERIA', 190, 'criteriaButton');
      this.createCriteriaRulesButton('RULES', 122, 'rulesButton');
    });
  }


  /**
 * Renders the timer for the scene.
 * @method
 * @private
 */
  createTimer() {
    this._startTime = dayjs();
    this._endTime = dayjs().add(3, 'hour');

    const timer = new Timer(this._startTime, this._endTime);
    timer.y = -75;
    this.timer = timer;
    this.addChild(this.timer);
    this.startProgressBar();
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

  static get events() {
    return {
      BUTTON_CLICKED: 'button_clicked',
    };
  }
}
