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
    this.inputElements = {};
  }

  async onCreated() {
    this.renderBackground();
    this.createFormElement();
    this.colorInputListener();

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
  createInputElement(element, type, text, id) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = text;
    const input = document.createElement(element);
    input.id = id;
    if (element !== "textarea") input.type = type;
    else {
      input.rows = "20";
    }

    Object.assign(label.style, {
      "font-family": "Raleway",
      "font-weight": "600",
      "margin-top": "4px",
      color: "white",
      "background-color": "black",
      "box-sizing": "border-box",
      display: "inline-flex",
      padding: "10px",
    });

    Object.assign(input.style, {
      "box-sizing": "border-box",
      width: "100%",
      resize: "none",
      padding: "15px",
      "font-size": "16px",
      "min-height": "54px",
    });

    return { label, input };
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
      top: "-97vh",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
    });

    form.classList.add("setup-form");
    document.body.appendChild(form);
    this.inputs.forEach((input) => {
      const element = this.createInputElement(
        input.element,
        input.type,
        input.text,
        input.id
      );
      form.appendChild(element.label);
      form.appendChild(element.input);
      this.inputElements[element.input.id] = element.input;
    });
  }

  /**
   * @returns {Object} Hakcathon's settings.
   */
  get submittedSettings() {
    const settings = {
      hackathonName: this.inputElements["hackathon-name"].value,

      mainColor: this.inputElements["main-color"].value,

      accentColor: this.inputElements["accent-color"].value,

      teams: this.inputElements["teams"].value.split(","),

      topics: this.inputElements["topics"].value.split(","),

      startTime: this.inputElements["start-time"].value,

      endTime: this.inputElements["end-time"].value,
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
      y: 375,
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
    this.background = new Background();
    this.addChild(this.background);
  }

  /**
   * Changes the color of the background and fx dynamically on input change.
   * @method
   * @private
   */
  colorInputListener() {
    const bg1 = this.inputElements["main-color"];
    const bg2 = this.inputElements["accent-color"];
    const fx = this.inputElements["fx-color"];
    bg1.addEventListener("change", () => {
      this.background.changeColors({
        bgColor1: bg1.value,
        bgColor2: this.background._colors.bgColor2,
      });
    });
    bg2.addEventListener("change", () => {
      this.background.changeColors({
        bgColor1: this.background._colors.bgColor1,
        bgColor2: bg2.value,
      });
    });
    fx.addEventListener("change", () => {
      this.background.changeColors({
        circleColor1: fx.value,
        circleColor2: fx.value,
      });
    });
  }
}
