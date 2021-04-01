import { Container } from "pixi.js";
import { pad } from "../core/utils";
import { Text } from "pixi.js";

/**
 * Represents the timer for the countdown scene.
 */
export default class Timer extends Container {
  constructor() {
    super();
    this.createCountdownTimer();
    /**
     * Represents the state of the timer.
     * @var
     */
    this.timer = null;
    this.sortableChildren = true;
    this.isPaused = true;
    this.timerPauseDelay = 10000;
  }

  /**
   * Gets the dates for the timer.
   * @returns {{string, string}} Object with start-date and end-date.
   * @method
   * @private
   */
  getDates() {
    const settings = JSON.parse(localStorage.getItem("hackathonSettings"));
    const startDate = this.parseHtmlDateTime(settings.startTime);
    const endDate = this.parseHtmlDateTime(settings.endTime);
    return { startDate, endDate };
  }

  /**
   *
   * @param {string} dateTime - from Html dateTime type input.
   * @returns {Object} - Javascript date object.
   * @method
   * @private
   */
  parseHtmlDateTime(dateTime) {
    const dateArr = dateTime.replace(/T|:/g, "-").split("-");
    dateArr[1] = pad(dateArr[1] - 1);
    const date = new Date(...dateArr);
    return date;
  }

  /**
   * Creates the countdown timer.
   * @method
   * @private
   */
  createCountdownTimer() {
    const { startDate, endDate } = this.getDates();
    let startDateTime = startDate.getTime();
    const endDateTime = endDate.getTime();
    setInterval(() => {
      const distance = endDateTime - startDateTime;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const allHours = days * 24 + hours;
      setTimeout(() => {
        startDateTime += 1000;
      }, this.timerPauseDelay);

      this.timer = `${pad(allHours)}:${pad(minutes)}:${pad(seconds)}`;
      this.drawTimer();
    }, 1000);
  }

  /**
   * Draws the countdown timer.
   * @method
   * @private
   */
  drawTimer() {
    this.removeChildren();
    const mainText = new Text(this.timer, {
      fill: "#ffffff",
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: 150,
      fontWeight: 800,
    });
    mainText.anchor.set(0.5);
    mainText.zIndex = 1;
    this.addChild(mainText);

    const blueText = new Text(this.timer, {
      fill: "#0f25ec",
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: 150,
      fontWeight: 800,
    });
    blueText.anchor.set(0.5);
    blueText.zIndex = 0;
    blueText.x += 7;
    this.addChild(blueText);

    const redText = new Text(this.timer, {
      fill: "#ff0000",
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: 150,
      fontWeight: 800,
    });
    redText.anchor.set(0.5);
    redText.zIndex = 0;
    redText.x -= 7;
    this.addChild(redText);
  }
}
