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
    this.inputs1 = config.scenes.Setup.inputs1;
    this.inputs2 = config.scenes.Setup.inputs2;
    this.inputElements = {};
  }

  async onCreated() {
    this.renderBackground();
    this.createFormElement1();
    this.createFormElement2();
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
   * Creates dom form1 element.
   * @method
   * @private
   */
  createFormElement1() {
    this.form1 = document.createElement("form");
    Object.assign(this.form1.style, {
      "align-self": "center",
      "justify-self": "center",
      display: "flex",
      "flex-direction": "column",
      height: "550px",
      width: "420px",
      position: "relative",
      top: "-90vh",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
    });

    this.form1.classList.add("setup-form");
    document.body.appendChild(this.form1);
    this.inputs1.forEach((input) => {
      const element = this.createInputElement(
        input.element,
        input.type,
        input.text,
        input.id
      );
      this.form1.appendChild(element.label);
      this.form1.appendChild(element.input);
      this.inputElements[element.input.id] = element.input;
    });
  }
  /**
   * Creates dom form2 element.
   * @method
   * @private
   */
  createFormElement2() {
    this.form2 = document.createElement("form");
    Object.assign(this.form2.style, {
      "align-self": "center",
      "justify-self": "center",
      display: "none",
      "flex-direction": "column",
      height: "550px",
      width: "420px",
      position: "relative",
      top: "-80vh",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
    });

    this.form2.classList.add("setup-form");
    document.body.appendChild(this.form2);
    this.inputs2.forEach((input) => {
      const element = this.createInputElement(
        input.element,
        input.type,
        input.text,
        input.id
      );
      this.form2.appendChild(element.label);
      this.form2.appendChild(element.input);
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

      fx1Color: this.inputElements["fx1-color"].value,

      fx2Color: this.inputElements["fx2-color"].value,

      teams: this.inputElements["teams"].value.split(","),

      topics: this.inputElements["topics"].value.split(","),

      startTime: this.inputElements["start-time"].value,

      endTime: this.inputElements["end-time"].value,

      rules: this.inputElements["rules"].value,

      criteria: this.inputElements["criteria"].value,
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
    this.button = new Button(buttonConfig);
    this.button.pivot.x = buttonConfig.width / 2;
    this.button.pivot.y = buttonConfig.height / 2;
    this.button.y += buttonConfig.y;
    this.addChild(this.button);

    this.button.once("click", () => this.displayNextForm());
  }

  displayNextForm() {
    this.form1.style.display = "none";
    this.form2.style.display = "flex";
    this.button.once("click", () => this.buttonClickHandler());
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
    const fx1 = this.inputElements["fx1-color"];
    const fx2 = this.inputElements["fx2-color"];
    bg1.addEventListener("change", () => {
      this.background.changeColors({
        bgColor1: bg1.value,
      });
    });
    bg2.addEventListener("change", () => {
      this.background.changeColors({
        bgColor2: bg2.value,
      });
    });
    fx1.addEventListener("change", () => {
      this.background.changeColors({
        circleColor1: fx1.value,
      });
    });
    fx2.addEventListener("change", () => {
      this.background.changeColors({
        circleColor1: fx1.value,
        circleColor2: fx2.value,
      });
    });
  }
}
