import Scene from "./Scene";
import { Sprite } from "pixi.js";
import Title from "../components/Title";
import Button from "../components/Button";
import config from "../config";

/**
 * Represents the intro scene of the app.
 * @class
 */
export default class Intro extends Scene {
  constructor() {
    super();
  }
  async onCreated() {
    this.drawLogo();
    this.drawTitle();
    this.drawButton();
  }

  /**
   * Renders the logo on the stage.
   * @method
   * @private
   */
  drawLogo() {
    const logo = new Sprite.from("logo");
    logo.anchor.set(0.5);
    logo.scale.x = 0.8;
    logo.scale.y = 0.8;
    this.addChild(logo);
  }

  /**
   * Renders the scene's title
   * @method
   * @private
   */
  drawTitle() {
    const title = new Title("The missing hackathon app");
    this.addChild(title);
  }

  drawButton() {
    const button = new Button(config.scenes.Intro.Button);
    button.pivot.x = 300 / 2;
    button.pivot.y = 50 / 2;
    button.y += 300;
    this.addChild(button);

    button.once("click", this.buttonClickHandler);
  }

  buttonClickHandler() {
    this.finishScene();
  }

  finishScene() {
    this.emit("finishScene");
  }
}
