import Scene from "./Scene";

export default class Timer extends Scene {
  constructor() {
    super();
  }

  async onCreated() {
    const settings = JSON.parse(localStorage.getItem("hackathonSettings"));
    console.log(settings);
  }
}
