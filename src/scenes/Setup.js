import Scene from "./Scene";
import { Sprite } from "pixi.js";
import config from "../config";
import Button from "../components/Button";
import Background from "../components/Background";
import Form from "../components/Form";

/**
 * Represents the setup scene of the app.
 */
export default class Setup extends Scene {
  static get events() {
    return { FINISH_SCENE: "finish-scene" };
  }

  constructor() {
    super();
    this.inputElements = {};
    this.formsConfig = config.scenes.Setup.forms;
    this.currentFormIndex = 0;
  }

  async onCreated() {
    this.renderBackground();
    this.drawButton();
    this.createForm();
    this.colorInputListener();
  }

  createForm() {
    if (this.form) {
      this.form.domElement.style.display = "none";
      this.form = new Form(this.formsConfig[this.currentFormIndex]);
    } else {
      this.form = new Form(this.formsConfig[this.currentFormIndex]);
      this.inputElements = {
        ...this.form.inputElements,
      };
    }
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

      rules: this.inputElements["rules"].value.split(","),

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
    this.button.on("click", () => this.buttonClickHandler());
  }

  /**
   * Handles Continue button click.
   * @method
   * @private
   */
  buttonClickHandler() {
    this.inputElements = {
      ...this.inputElements,
      ...this.form.inputElements,
    };
    if (this.currentFormIndex >= this.formsConfig.length - 1) {
      localStorage.setItem(
        "hackathonSettings",
        JSON.stringify(this.submittedSettings)
      );
      this.finishScene();
    } else {
      this.currentFormIndex++;
      this.createForm();
    }
  }

  /**
   * Emits an event.
   * @method
   * @private
   */
  finishScene() {
    this.emit(Setup.events.FINISH_SCENE, { settings: this.submittedSettings });
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
