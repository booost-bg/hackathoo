import { Container, Text } from "pixi.js";

export default class HackathonLogo extends Container {
  constructor(text) {
    super();
    this.text = text;
    this.drawLogo();
  }

  drawLogo() {
    const logo = new Text(this.text, {
      fontFamily: "Raleway",
      fontStyle: "normal",
      fontWeight: 300,
      fontSize: 64,
      lineHeight: 75,
      fill: "#ffffff",
    });
    logo.anchor.set(0.5);
    logo.y = -350;
    this.addChild(logo);
  }
}
