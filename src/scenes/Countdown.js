import Scene from "./Scene";
import Timer from "../components/Timer";

export default class Countdown extends Scene {
  constructor() {
    super();
  }

  async onCreated() {
    this.timer = new Timer();
    this.addChild(this.timer);
  }
}
