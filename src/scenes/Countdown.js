import Scene from "./Scene";
import Timer from "../components/Timer";
import Title from "../components/Title";
import HackathonLogo from "../components/HackathonLogo";

/**
 * Represents the countdown before the hackaton ends.
 * @class
 */
export default class Countdown extends Scene {
  async onCreated() {
    this.createTimer();
    this.createTitle();
    this.createLogo();
  }
  /**
   * Renders the timer for the scene.
   * @method
   * @private
   */
  createTimer() {
    const timer = new Timer();
    timer.y = -100;
    this.addChild(timer);
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

    title.y = 100;
    this.addChild(title);
  }

  createLogo() {
    const text = JSON.parse(localStorage.getItem("hackathonSettings"))
      .hackatonName;
    const logo = new HackathonLogo(text);
    this.addChild(logo);
  }
}
