import Button from '../components/Button';
import CountdownBase from './CountdownBase';
import Timer from '../components/Timer';
import RulesCriteria from '../components/RulesCriteria';
import dayjs from 'dayjs';

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class CountdownStart extends CountdownBase {
  async onCreated() {
    super.onCreated();

    this._createTimer();
    this._createCriteriaRulesButton('CRITERIA', 190, 'criteriaButton');
    this._createCriteriaRulesButton('RULES', 122, 'rulesButton');
    this._initRulesCriteria();
  }

  /**
   * Initializes the rules & criteria component
   * @method
   * @private
   */
  _initRulesCriteria() {
    const rulesCriteria = new RulesCriteria();
    this.rulesCriteria = rulesCriteria;
    this.addChild(rulesCriteria);
    this._eventListeners();
  }

  /**
   * Initializes event listeners for buttons.
   * @method
   * @private
   */
  _eventListeners() {
    this.on(CountdownStart.events.BUTTON_CLICKED, (key) => {
      if (key === 'rulesButton') {
        this.rulesCriteria._handleDomElementInAnimation('RULES', key);
      } else if (key === 'criteriaButton') {
        this.rulesCriteria._handleDomElementInAnimation('CRITERIA', key);
      }
    });
  }

  /**
 * Renders the timer for the scene.
 * @method
 * @private
 */
  _createTimer() {
    this._startTime = dayjs();
    this._endTime = dayjs().add(3, 'hour');

    const timer = new Timer(this._startTime, this._endTime);
    timer.y = -75;
    this.timer = timer;
    this.addChild(this.timer);
    this._startProgressBar();
  }

  /**
   * Initializes a Button in the scene, based on the passed parameters
   * @method
   * @private
   * @param {Sting} text - The text of the button
   * @param {Number} y - Vertical position
   * @param {String} key - Unique identifier of the Button type
   * @memberof CountdownStart
   */
  _createCriteriaRulesButton(text, y, key) {
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
   * The events the CountDownStart class can emit
   *
   * @readonly
   * @static
   * @memberof CountdownStart
   */
  static get events() {
    return {
      BUTTON_CLICKED: 'button_clicked',
    };
  }
}
