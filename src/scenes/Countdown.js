import Scene from "./Scene";
import Timer from "../components/Timer";
import Title from "../components/Title";

export default class Countdown extends Scene {
  constructor() {
    super();
  }

  async onCreated() {
    this.createTimer();
    this.createTitle();
  }

  createTimer() {
    const timer = new Timer();
    this.addChild(timer);
  }
  createTitle() {
    const endTime = JSON.parse(localStorage.getItem("hackathonSettings"))
      .endTime;
    const parsedEndTime = endTime.replace(/-|T/g, "/");

    const title = new Title(`Ends at ${parsedEndTime}`);
    this.addChild(title);
  }
}
