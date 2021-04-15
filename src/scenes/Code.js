import Scene from "./Scene";
import Background from "../components/Background";
import { Container, Sprite, Texture, Text } from "pixi.js";
import HackathonLogo from "../components/HackathonLogo";
import Button from "../components/Button";
import gsap from "gsap/all";

/**
 * Represents the Code scene.
 * @class
 */
export default class Code extends Scene {
  constructor(apiData) {
    super();
    this.apiData = apiData;
    this.code = apiData.code;
  }

  /**
   * Initializes the class.
   * @method
   * @public
   */
  onCreated() {
    this._drawBackground();
    this._drawLogo();
    this._drawButton();
    this._drawTitle();
    this._drawDisplay();
    this._drawClipboardMessage();
  }

  /**
   * Draws the background of the scene.
   * @method
   * @private
   */
  _drawBackground() {
    const background = new Background();
    this.addChild(background);
  }

  /**
   * Draws the logo of the scene.
   * @method
   * @private
   */
  _drawLogo() {
    const logo = new HackathonLogo(
      JSON.parse(localStorage.getItem("hackathonSettings")).hackathonName
    );
    this.addChild(logo);
  }

  /**
   * Draws the continue button.
   * @method
   * @private
   */
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

  /**
   * Draws the title of the scene.
   * @method
   * @private
   */
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

  /**
   * Displays a code for the user.
   * @method
   * @private
   */
  _drawDisplay() {
    const container = new Container();
    const rectangle = new Sprite.from(Texture.WHITE);
    rectangle.width = 1000;
    rectangle.height = 350;
    rectangle.tint = 0xffffff;
    rectangle.anchor.set(0.5);
    rectangle.alpha = 0.3;

    const pixiText = new Text(this.code, {
      fill: "#ffffff",
      fontFamily: "Raleway",
      fontStyle: "italic",
      fontSize: 288,
      fontWeight: 1000,
      padding: 20,
    });
    pixiText.anchor.set(0.55, 0.5);

    container.addChild(rectangle);
    container.addChild(pixiText);
    container.y += 35;

    container.interactive = true;

    container.on("click", () => {
      this._copyCode();
    });

    this.addChild(container);
  }

  /**
   * Copies the displayed code to the user's clipboard.
   * @method
   * @private
   */
  _copyCode() {
    navigator.clipboard.writeText(this.code);
    this._animateClipboardMessage();
  }

  /**
   * Animates the clipboard message container.
   * @method
   * @private
   */
  _animateClipboardMessage() {
    const tl = gsap.timeline();
    tl.to(this.clipboardMessageContainer, {
      alpha: 1,
      duration: 0.5,
    }).to(
      this.clipboardMessageContainer,
      {
        alpha: 0,
        duration: 0.5,
      },
      "+=1.5"
    );
  }

  /**
   * Emits an event.
   * @method
   * @private
   */
  _finishScene() {
    this.emit(Scene.events.EXIT, {
      to: "topics",
      data: this.apiData,
    });
  }

  /**
   * Draws the copy code to clipboard message container.
   * @method
   * @private
   */
  _drawClipboardMessage() {
    this.clipboardMessageContainer = new Container();
    const rectangle = new Sprite.from(Texture.WHITE);
    rectangle.width = 300;
    rectangle.height = 55;
    rectangle.tint = 0xffffff;
    rectangle.anchor.set(0.5);
    rectangle.alpha = 0.3;

    const text = "Copied to clipboard!";

    const pixiText = new Text(text, {
      fill: "#ffffff",
      fontFamily: "Raleway",
      fontSize: 28,
      padding: 20,
    });
    pixiText.anchor.set(0.5, 0.5);

    this.clipboardMessageContainer.addChild(rectangle);
    this.clipboardMessageContainer.addChild(pixiText);
    this.clipboardMessageContainer.y += 265;

    this.clipboardMessageContainer.interactive = true;

    this.clipboardMessageContainer.on("click", () => {
      navigator.clipboard.writeText(text);
    });

    this.clipboardMessageContainer.alpha = 0;

    this.addChild(this.clipboardMessageContainer);
  }
}
