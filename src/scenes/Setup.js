import Scene from "./Scene";
import { Sprite } from "pixi.js";

export default class Setup extends Scene {
  constructor() {
    super();
    this.inputs = [
      {
        isBig: false,
        text: "Hackaton Name",
      },
      {
        isBig: false,
        text: "Main Color",
      },
      {
        isBig: false,
        text: "Accent Color",
      },
      {
        isBig: true,
        text: "Teams (separated by comas)",
      },
      {
        isBig: true,
        text: "Topics (separated by comas)",
      },
      {
        isBig: false,
        text: "Start time",
      },
      {
        isBig: false,
        text: "End time",
      },
    ];
    this.inputElements = [];
  }

  async onCreated() {
    this.drawLogo();
    this.createFormElement();
    setTimeout(() => {
      console.log(this.submittedSettings);
    }, 30000);
  }

  createInputElement(isBig, text) {
    const input = document.createElement("input");

    input.addEventListener(
      "focus",
      () => {
        input.value = "";
      },
      { once: true }
    );
    input.classList.add(isBig ? "input-big" : "input-small");
    input.value = text;
    return input;
  }

  createFormElement() {
    const form = document.createElement("form");
    form.classList.add("setup-form");
    document.body.appendChild(form);
    this.inputs.forEach((input) => {
      const element = this.createInputElement(input.isBig, input.text);
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
    return [
      {
        hackatonName: this.inputElements[0].value,
      },
      {
        mainColor: this.inputElements[1].value,
      },
      {
        accentColor: this.inputElements[2].value,
      },
      {
        teams: this.inputElements[3].value.split(","),
      },
      {
        topics: this.inputElements[4].value.split(","),
      },
      {
        startTime: this.inputElements[5].value,
      },
      {
        endTime: this.inputElements[6].value,
      },
    ];
  }
}
