import Scene from "./Scene";
import config from "../config";
import Button from "../components/Button";
import Background from "../components/Background";
import Form from "../components/Form";

/**
 * Represents the setup scene of the app.
 */
export default class Setup extends Scene {
  static get events() {
    return { FINISH_SCENE: "finish-scene", SUBMIT: "submit" };
  }

  constructor() {
    super();
    this.forms = [];
    this.formsConfig = config.scenes.Setup.forms;
    this.currentFormIndex = 0;
  }

  async onCreated() {
    this.renderBackground();
    this.drawButton();
    this.createForm();
    this.colorInputListener();
  }

  /**
   * Creates a form.
   * @method
   * @private
   */
  createForm() {
    if (this.form) this.form.domElement.style.display = "none";
    this.form = new Form(this.formsConfig[this.currentFormIndex]);
    this.forms = [...this.forms, this.form];
  }

  /**
   * @returns {Object} Hakcathon's settings data.
   */
  get submittedSettings() {
    let settingsObject = {};
    this.forms.forEach((form) => {
      for (let setting in form.inputElements) {
        const input = form.inputElements[setting];

        switch (input.getAttribute("data-format")) {
          case "list":
            settingsObject[setting] = input.value
              .split(",")
              .map((x) => x.trim());
            break;
          default:
            settingsObject[setting] = input.value;
        }
      }
    });
    return settingsObject;
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
  async finishScene() {
    this.button.startLoading();
    this.forms.forEach((form) => {
      form.domElement.remove();
    });
    this.emit(Setup.events.SUBMIT, {
      hackathonSettings: this.submittedSettings,
    });
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
    const bg1 = this.forms[0].inputElements["mainColor"];
    const bg2 = this.forms[0].inputElements["accentColor"];
    const fx1 = this.forms[0].inputElements["fx1Color"];
    const fx2 = this.forms[0].inputElements["fx2Color"];
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
