import Scene from "./Scene";
import Background from "../components/Background";
import { Container, Sprite, Texture, Text } from "pixi.js";
import HackathonLogo from "../components/HackathonLogo";
import Button from "../components/Button";

export default class Code extends Scene {
  static get events() {
    return { FINISH_SCENE: "finish-scene" };
  }

  onCreated() {
    this._drawBackground();
    this._drawLogo();
    this._drawButton();
    this._drawTitle();
    this._drawDisplay();
  }

  _drawBackground() {
    const background = new Background();
    this.addChild(background);
  }
  _drawLogo() {
    const logo = new HackathonLogo(
      JSON.parse(localStorage.getItem("hackathonSettings")).hackathonName
    );
    this.addChild(logo);
  }
  _drawButton() {
    const buttonConfig = {
      text: "CONTINUE",
      fontSize: 24,
      width: 367,
      height: 53,
      curveSize: 13,
      y: 350,
    };
    const button = new Button(buttonConfig);
    button.pivot.x = buttonConfig.width / 2;
    button.pivot.y = buttonConfig.height / 2;
    button.y += buttonConfig.y;
    this.addChild(button);

    button.on("click", () => {
      this._finishScene();
    });
  }

  _drawTitle() {
    const container = new Container();
    const rectangle = new Sprite.from(Texture.WHITE);
    rectangle.width = 300;
    rectangle.height = 80;
    rectangle.tint = 0x000000;
    rectangle.anchor.set(0.5);

    const text = new Text("Your Code", {
      fill: "#ffffff",
      fontFamily: "Raleway, sans-serif",
      fontStyle: "italic",
      fontSize: 40,
      fontWeight: 800,
      padding: 20,
    });
    text.anchor.set(0.5);

    container.addChild(rectangle);
    container.addChild(text);

    container.y -= 180;
    container.x -= 350;

    this.addChild(container);
  }

  _drawDisplay() {
    const container = new Container();
    const rectangle = new Sprite.from(Texture.WHITE);
    rectangle.width = 1000;
    rectangle.height = 350;
    rectangle.tint = 0xffffff;
    rectangle.anchor.set(0.5);
    rectangle.alpha = 0.3;

    const text = new Text("VB54G", {
      fill: "#ffffff",
      fontFamily: "Raleway",
      fontStyle: "italic",
      fontSize: 288,
      fontWeight: 1000,
      padding: 20,
    });
    text.anchor.set(0.55, 0.5);

    container.addChild(rectangle);
    container.addChild(text);
    container.y += 35;

    this.addChild(container);
  }

  /**
   * Emits an event.
   * @method
   * @private
   */
  _finishScene() {
    this.emit(Code.events.FINISH_SCENE);
  }
}
