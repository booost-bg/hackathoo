import Scene from "./Scene";

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
    this.createFormElement();
  }

  createInputElement(isBig, text) {
    const input = document.createElement("input");
    input.classList.add(isBig ? "input-big" : "input-small");
    input.innerText = text;
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
}
