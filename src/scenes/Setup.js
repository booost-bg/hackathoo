import Scene from "./Scene";
import { Sprite } from "pixi.js";
import config from "../config";

export default class Setup extends Scene {
  constructor() {
    super();
    this.inputs = config.scenes.Setup.inputs;
    this.inputElements = [];
  }

  async onCreated() {
    this.drawLogo();
    this.createFormElement();
    setTimeout(() => {
      console.log(this.submittedSettings);
    }, 40000);
  }

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
      top: "-75vh",
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

  drawLogo() {
    const logo = new Sprite.from("logo");
    logo.anchor.set(0.5);
    logo.scale.x = 0.4;
    logo.scale.y = 0.4;
    logo.y = -window.innerHeight / 3;
    this.addChild(logo);
  }

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
    localStorage.setItem("hackathonSettings", JSON.stringify(settings));
    return settings;
  }
}
