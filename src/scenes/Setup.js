import Scene from "./Scene";
import { Sprite } from "pixi.js";
import config from "../config";
import Button from "../components/Button";
import Background from "../components/Background";

/**
 * Represents the setup scene of the app.
 */
export default class Setup extends Scene {
  constructor() {
    super();
    this.inputs = config.scenes.Setup.inputs;
    this.inputElements = [];
  }

  async onCreated() {
    this.renderBackground();
    this.drawLogo();
    this.createFormElement();
    this.drawButton();
  }

  /**
   * Creates a dom input element.
   * @param {string} element
   * @param {string} type
   * @param {string} text
   * @returns DOM element.
   * @method
   * @private
   */
  createInputElement(element, type, text) {
    const input = document.createElement(element);
    Object.assign(input.style, {
      "box-sizing": "border-box",
      width: "100%",
      resize: "none",
      margin: "7px",
      padding: "15px",
      "font-size": "16px",
      "min-height": "54px",
    });
    input.placeholder = text;
    if (element !== "textarea") {
      input.type = "text";
      input.addEventListener(
        "focus",
        () => {
          input.type = type;
        },
        { once: true }
      );
    } else {
      input.rows = "20";
    }
    return input;
  }

  /**
   * Creates dom form element.
   * @method
   * @private
   */
  createFormElement() {
    const form = document.createElement("form");
    Object.assign(form.style, {
      "align-self": "center",
      "justify-self": "center",
      display: "flex",
      "flex-direction": "column",
      height: "550px",
      width: "420px",
      position: "relative",
      top: "-80vh",
      "justify-content": "space-between",
      "box-sizing": "border-box",
    });

    form.classList.add("setup-form");
    document.body.appendChild(form);
    this.inputs.forEach((input) => {
      const element = this.createInputElement(
        input.element,
        input.type,
        input.text
      );
      form.appendChild(element);
      this.inputElements = [...this.inputElements, element];
    });
  }

  /**
   * Renders the app's logo.
   * @method
   * @private
   */
  drawLogo() {
    const logo = new Sprite.from("logo");
    logo.anchor.set(0.5);
    logo.scale.x = 0.4;
    logo.scale.y = 0.4;
    logo.y = -window.innerHeight / 2.7;
    this.addChild(logo);
  }

  /**
   * @returns {Object} Hakcathon's settings.
   */
  get submittedSettings() {
    const settings = {
      hackatonName: this.inputElements[0].value,

      mainColor: this.inputElements[1].value,

      accentColor: this.inputElements[2].value,

      teams: this.inputElements[3].value.split(","),

      topics: this.inputElements[4].value.split(","),

      startTime: this.inputElements[5].value,

      endTime: this.inputElements[6].value,
    };
    return settings;
  }

  /**
   * Draws the continue button for the scene switch.
   * @method
   * @private
   */
  drawButton() {
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

    button.once("click", () => this.buttonClickHandler());
  }

  /**
   * Handles Continue button click.
   * @method
   * @private
   */
  buttonClickHandler() {
    localStorage.setItem(
      "hackathonSettings",
      JSON.stringify(this.submittedSettings)
    );
    this.finishScene();
  }

  /**
   * Emits an event.
   * @method
   * @private
   */
  finishScene() {
    this.emit("finishScene", { settings: this.submittedSettings });
  }

  /**
   * Renders the background of the scene.
   * @method
   * @private
   */
  renderBackground() {
    const background = new Background();
    this.addChild(background);
  }
}
