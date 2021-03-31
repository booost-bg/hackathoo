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
  }

  async onCreated() {
    this.drawLogo();
    this.createFormElement();
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
      form.appendChild(this.createInputElement(input.isBig, input.text));
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
}
