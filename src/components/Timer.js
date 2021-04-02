import { Container } from "pixi.js";
import { pad } from "../core/utils";
import { Text } from "pixi.js";
import dayjs from "dayjs";
/**
 * Represents the timer for the countdown scene.
 */
export default class Timer extends Container {
  constructor() {
    super();
    this.drawInitialTimer();
    this.createCountdownTimer();
    /**
     * Represents the state of the timer.
     * @var
     */
    this.timer = null;
    this.blueX = 3;
    this.redX = -3;
    this.sortableChildren = true;
    this.isPaused = false;
    this.parallax();
  }

  /**
   * Gets the dates for the timer and parses them.
   * @returns {{string, string}} Object with start-date and end-date.
   * @method
   * @private
   */
  getDates() {
    const settings = JSON.parse(localStorage.getItem("hackathonSettings"));
    const startDate = dayjs(settings.startTime).$d;
    const endDate = dayjs(settings.endTime).$d;
    return { startDate, endDate };
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

      if (!this.isPaused) startDateTime += 1000;

      this.timer = `${pad(allHours)}:${pad(minutes)}:${pad(seconds)}`;
      this.drawTimer();
    }, 1000);
  }

  /**
   * Draws the timer before the set interval starts.
   * @method
   * @private
   */
  drawInitialTimer() {
    const { startDate, endDate } = this.getDates();
    let startDateTime = startDate.getTime();
    const endDateTime = endDate.getTime();
    const distance = endDateTime - startDateTime;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const allHours = days * 24 + hours;
    this.timer = `${pad(allHours)}:${pad(minutes)}:${pad(seconds)}`;
    this.drawTimer();
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

    this.blueText = new Text(this.timer, {
      fill: "#0f25ec",
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: 150,
      fontWeight: 800,
    });
    this.blueText.anchor.set(0.5);
    this.blueText.zIndex = 0;
    this.blueText.x = this.blueX;
    this.addChild(this.blueText);

    this.redText = new Text(this.timer, {
      fill: "#ff0000",
      fontFamily: "Verdana, Geneva, sans-serif",
      fontSize: 150,
      fontWeight: 800,
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

    document.addEventListener("mousemove", (event) => {
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
  pauseTimer(time) {
    this.isPaused = true;
    setTimeout(() => {
      this.isPaused = false;
    }, time * 60000);
  }
}
