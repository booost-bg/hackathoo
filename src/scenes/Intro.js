import Scene from "./Scene";
import { Sprite } from "pixi.js";

export default class Intro extends Scene {
  constructor() {
    super();
  }
  async onCreated() {
    this.drawLogo();
    this.drawTitle();
  }
  drawLogo() {}
  drawTitle() {}
}
