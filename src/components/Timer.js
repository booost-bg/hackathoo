import { Container, Text } from 'pixi.js';
import { pad } from '../core/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const EVENTS = {
  TIMER_END: 'timer_end',
  LAST_TEN_SECONDS: 'last_ten_seconds',
};
const TIME_BEFORE_FINAL_COUNTDOWN = 11000;
const MIN_VALUE = 1000;

/**
 * Represents the timer for the countdown scene.
 */
export default class Timer extends Container {
  /**
   * @param {Date} startTime The timer start value
   * @param {Date} endTime The timer end value
   */
  constructor(startTime = dayjs(), endTime = dayjs().add(1, 'hour')) {
    super();
    this.startTime = startTime;
    this.endTime = endTime;

    /**
     * Represents the timer total value.
     * @type {Number}
     */
    this.totalTime = 0;
    this.drawInitial();
    this.createCountdown();
    /**
     * Represents the state of the timer.
     * @var
     */
    this.timer = null;
    /**
     * Represents the break interval.
     * @type {Function}
     */
    this.breakInterval = null;
    this.blueX = 3;
    this.redX = -3;
    this.sortableChildren = true;
    this.isPaused = false;
    this.parallax();
    this.breakTimer = null;
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Gets the dates for the timer and parses them.
   * @returns {{string, string}} Object with start-date and end-date.
   * @method
   * @private
   */
  getDates() {
    const startDate = dayjs(this.startTime);
    const endDate = dayjs(this.endTime);

    return { startDate, endDate };
  }

  /**
   * Draws the timer before the set interval starts.
   * @method
   * @private
   */
  drawInitial() {
    const { startDate, endDate } = this.getDates();
    const distance = endDate.diff(startDate);
    const { hours, minutes, seconds } = this.parseDistanceHours(distance);
    this.timer = `${hours}:${minutes}:${seconds}`;
    this.drawTexts();
  }

  /**
   * Creates the countdown timer.
   * @method
   * @private
   */
  createCountdown() {
    const { endDate } = this.getDates();
    const { startDate } = this.getDates();
    this.startDate = startDate;
    this.totalTime = endDate.diff(this.startDate);
    this.interval = setInterval(() => {
      const distance = endDate.diff(this.startDate);
      this.onUpdate(distance);
      const { hours, minutes, seconds } = this.parseDistanceHours(distance);
      if (!this.isPaused) {
        this.startDate = dayjs(this.startDate).add(1, 'second');
        // console.log(this.startDate);
        this.removeChildren();
        this.timer = `${hours}:${minutes}:${seconds}`;
        this.drawTexts();
      }
    }, 1000);
  }

  getProgress() {
    return this.startDate;
  }
  /**
   * Parses the distance between two dates from milliseconds to h m s.
   * @param {number} distance - miliseconds
   * @returns {Object} Hours, minutes, seconds.
   */
  parseDistanceHours(distance) {
    const distances = dayjs.duration(distance).$d;
    return {
      hours: pad(distances.days * 24 + distances.hours),
      minutes: pad(distances.minutes),
      seconds: pad(distances.seconds),
    };
  }

  /**
   * Parses the distance between two dates from milliseconds to m s.
   * @param {number} distance - miliseconds
   * @returns {Object} Minutes, seconds.
   */
  parseDistanceMinutes(distance) {
    const distances = dayjs.duration(distance).$d;
    return {
      minutes: pad(distances.hours * 60 + distances.minutes),
      seconds: pad(distances.seconds),
    };
  }

  /**
   * Draws the countdown timer.
   * @method
   * @private
   */
  drawTexts() {
    const mainText = new Text(this.timer, {
      fill: '#ffffff',
      fontFamily: 'Raleway, sans-serif',
      fontStyle: 'italic',
      fontSize: 200,
      fontWeight: 800,
      padding: 20,
    });
    mainText.anchor.set(0.5);
    mainText.zIndex = 1;
    this.addChild(mainText);

    this.blueText = new Text(this.timer, {
      fill: '#0f25ec',
      fontFamily: 'Raleway, sans-serif',
      fontStyle: 'italic',
      fontSize: 200,
      fontWeight: 800,
      padding: 20,
    });
    this.blueText.anchor.set(0.5);
    this.blueText.zIndex = 0;
    this.blueText.x = this.blueX;
    this.addChild(this.blueText);

    this.redText = new Text(this.timer, {
      fill: '#ff0000',
      fontFamily: 'Raleway, sans-serif',
      fontStyle: 'italic',
      fontSize: 200,
      fontWeight: 800,
      padding: 20,
    });
    this.redText.anchor.set(0.5);
    this.redText.zIndex = 0;
    this.redText.x = this.redX;
    this.addChild(this.redText);
  }

  /**
   * Adds parallax effect to the text.
   * @private
   * @method
   */
  parallax() {
    this.request = null;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      this.mouse.x = event.pageX;
      this.mouse.y = event.pageY;

      cancelAnimationFrame(this.request);
      this.request = requestAnimationFrame(() => this.update());
    });
  }
  /**
   * Updates the red and blue texts's x position.
   * @method
   * @private
   */
  update() {
    if (!this.redText) return;
    if (this.mouse.x < window.innerWidth / 2) {
      this.redText.x = -(window.innerWidth / 2 - this.mouse.x) * 0.01;
      this.redX = -(window.innerWidth / 2 - this.mouse.x + 2) * 0.01;
    } else if (this.mouse.x > window.innerWidth / 2) {
      this.blueText.x = (this.mouse.x - window.innerWidth / 2) * 0.01;
      this.blueX = (this.mouse.x - window.innerWidth / 2) * 0.01;
    }
  }

  /**
   * Pauses the timer.
   * @method
   * @public
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resumes the timer.
   * @method
   * @public
   */
  play() {
    this.isPaused = false;
  }

  /**
   * @param {Number} distance Time left in milliseconds.
   * @method
   * @private
   */
  onUpdate(distance) {
    if (distance < TIME_BEFORE_FINAL_COUNTDOWN) {
      this.emit(Timer.events.LAST_TEN_SECONDS);
    }

    if (distance < MIN_VALUE) {
      this.emit(Timer.events.TIMER_END);
    }
  }

  /**
   * Clear timer interval
   * @method
   * @public
   */
  clearInterval() {
    window.clearInterval(this.interval);
  }
}
