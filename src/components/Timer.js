import { Container, Text } from 'pixi.js';
import { pad } from '../core/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
/**
 * Represents the timer for the countdown scene.
 */
export default class Timer extends Container {
  constructor() {
    super();
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

  /**
   * Gets the dates for the timer and parses them.
   * @returns {{string, string}} Object with start-date and end-date.
   * @method
   * @private
   */
  getDates() {
    const settings = JSON.parse(localStorage.getItem('hackathonSettings'));
    const startDate = dayjs(settings.startTime);
    const endDate = dayjs(settings.endTime);
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
    let { startDate } = this.getDates();
    this.totalTime = endDate.diff(startDate);
    setInterval(() => {
      const distance = endDate.diff(startDate);
      const { hours, minutes, seconds } = this.parseDistanceHours(distance);
      if (!this.isPaused) {
        startDate = dayjs(startDate).add(1, 'second');
        this.removeChildren();
        this.timer = `${hours}:${minutes}:${seconds}`;
        this.drawTexts();
      }
    }, 1000);
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
   * @param {number} time - Minutes.
   * @method
   * @private
   */
  pause(time) {
    if (this.breakInterval) clearInterval(this.breakInterval);
    this.isPaused = true;
    this.createBreakTimer(time);
    setTimeout(() => {
      this.isPaused = false;
    }, time * 60000);
  }

  createBreakTimer(time) {
    let timeMilliseconds = dayjs.duration(time * 60000).asMilliseconds();
    this.breakInterval = setInterval(() => {
      if (timeMilliseconds !== 0) {
        const { minutes, seconds } = this.parseDistanceMinutes(
          timeMilliseconds
        );
        this.breakTimer = `${minutes}:${seconds}`;
        this.drawBreakTimerText();
        timeMilliseconds -= 1000;
      } else {
        clearInterval(this.breakInterval);
      }
    }, 1000);
  }

  drawBreakTimerText() {
    this.removeChild(this.breakTimerText);
    this.breakTimerText = new Text(`Break: ${this.breakTimer}`, {
      fill: '#000000',
      fontFamily: 'Raleway, sans-serif',
      fontSize: 50,
      fontWeight: 300,
    });
    this.breakTimerText.anchor.set(0.5);
    this.breakTimerText.y = -100;
    this.addChild(this.breakTimerText);
  }
}
