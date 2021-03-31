import Scene from "./Scene";
import { Sprite, Text, Graphics, Container } from "pixi.js";

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
    const container = new Container();
    container.addChild(this.drawTitleBox());
    container.addChild(this.createTitleText());
    this.addChild(container);
  }

  drawTitleBox() {
    const box = new Graphics();
    box.beginFill(0xffffff);
    box.drawRect(0, 0, 400, 75);
    box.pivot.x = 200;
    box.pivot.y = 75 / 2;
    box.y = 200;
    return box;
  }

  createTitleText() {
    const text = new Text("The missing hackathon app", {
      fill: "#000000",
      fontFamily: "sans-serif",
      fontSize: 30,
      fontWeight: 400,
    });
    text.anchor.set(0.5);
    text.y = 200;
    return text;
  }
}
