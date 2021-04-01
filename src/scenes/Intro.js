import Scene from "./Scene";
import { Sprite } from "pixi.js";
import Title from "../components/Title";

export default class Intro extends Scene {
  constructor() {
    super();
  }
  async onCreated() {
    this.drawLogo();
    this.drawTitle();
  }
  drawLogo() {
    const logo = new Sprite.from("logo");
    logo.anchor.set(0.5);
    logo.scale.x = 0.8;
    logo.scale.y = 0.8;
    this.addChild(logo);
  }

  drawTitle() {
    const title = new Title("The missing hackathon app");
    this.addChild(title);
  }
}
