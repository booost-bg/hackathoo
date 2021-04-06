import Scene from "./Scene";
import Timer from "../components/Timer";
import Title from "../components/Title";
import HackathonLogo from "../components/HackathonLogo";
import Button from "../components/Button";

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class Countdown extends Scene {
  async onCreated() {
    this.createTimer();
    this.createTitle();
    this.createLogo();
    this.createPauseTimerButton("15 min break", 220, 15);
    this.createPauseTimerButton("30 min break", 290, 30);
    this.createPauseTimerButton("60 min break", 360, 60);
  }

  /**
   * Renders the timer for the scene.
   * @method
   * @private
   */
  createTimer() {
    const timer = new Timer();
    timer.y = -75;
    this.timer = timer;
    this.addChild(this.timer);
  }

  /**
   * Renders the scene's title/
   * @method
   * @private
   */
  createTitle() {
    const endTime = JSON.parse(localStorage.getItem("hackathonSettings"))
      .endTime;
    const parsedEndTime = endTime.replace(/-|T/g, "/");

    const title = new Title(`Ends at ${parsedEndTime}`);

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
      localStorage.getItem("hackathonSettings")
    ).hackathonName.toUpperCase();
    const logo = new HackathonLogo(text);
    this.addChild(logo);
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
      this.timer.pause(duration);
    });

    this.addChild(button);
  }
}
