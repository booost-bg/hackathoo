import { Container } from "pixi.js";
import Button from "./Button";
import gsap from "gsap/all";

export default class RulesCriteria extends Container {
  constructor() {
    super();

    this.rules = JSON.parse(localStorage.getItem("hackathonSettings")).rules;
    this.criteria = JSON.parse(
      localStorage.getItem("hackathonSettings")
    ).criteria;

    this._tl = gsap.timeline();

    this._drawButtons();

    this._eventListeners();
  }

  /**
   * Initializes event listeners for buttons.
   * @method
   * @private
   */
  _eventListeners() {
    this.rulesButton.on("click", () => {
      this._handleDomElementInAnimation("RULES", this.rules);
    });

    this.criteriaButton.on("click", () => {
      this._handleDomElementInAnimation("CRITERIA", this.criteria);
    });
  }

  /**
   * Handles the "opening" animation of the dom element.
   * @param {string} title
   * @param {string} content
   * @method
   * @private
   */
  _handleDomElementInAnimation(title, content) {
    this._generateDomElement(title, content);

    this._tl.from(this.domElement, {
      x: 1000,
    });
  }

  /**
   * Draws the buttons.
   * @method
   * @private
   */
  _drawButtons() {
    this.rulesButton = new Button({
      text: "RULES",
      fontSize: 18,
      width: 172,
      height: 55,
      curveSize: 14,
    });
    this.rulesButton.pivot.x = 172 / 2;
    this.rulesButton.pivot.y = 55 / 2;
    this.rulesButton.x -= 780;
    this.rulesButton.y += 400;
    this.addChild(this.rulesButton);
    this.criteriaButton = new Button({
      text: "CRITERIA",
      fontSize: 18,
      width: 172,
      height: 55,
      curveSize: 14,
    });
    this.criteriaButton.pivot.x = 172 / 2;
    this.criteriaButton.pivot.y = 55 / 2;
    this.criteriaButton.x -= 780;
    this.criteriaButton.y += 330;

    this.addChild(this.criteriaButton);
  }

  /**
   * Generates a dom element.
   * @param {string} title
   * @param {string} content
   * @method
   * @private
   */

  _generateDomElement(title, content) {
    this.title = document.createElement("h1");

    Object.assign(this.title.style, {
      display: "flex",
      "flex-direction": "column",
      "font-family": "Raleway",
      "font-size": "60px",
      "font-weight": "800",
      position: "absolute",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
      top: "50px",
      left: `1150px`,
      "z-index": "1",
    });

    this.title.innerText = title;

    this.textArea = document.createElement("textarea");
    Object.assign(this.textArea.style, {
      outline: "none",
      display: "flex",
      "flex-direction": "column",
      "font-family": "Raleway",
      "font-size": "18px",
      padding: "68px",
      "padding-top": "180px",
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth / 2.3}px`,
      position: "absolute",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
      left: `1085px`,
      "z-index": "0",
    });

    this.textArea.innerText = content;

    this.exitButton = document.createElement("button");

    Object.assign(this.exitButton.style, {
      outline: "none",
      border: "none",
      display: "flex",
      "flex-direction": "column",
      "font-family": "Raleway",
      "font-size": "50px",
      "font-weight": "800",
      height: `70px`,
      width: `70px`,
      color: "white",
      "background-color": "black",
      position: "absolute",
      "justify-content": "center",
      "box-sizing": "border-box",
      "align-items": "center",
      left: `${window.innerWidth - 70}px`,
      cursor: "pointer",
      "z-index": "1",
    });

    this.exitButton.innerHTML = "x";

    this.exitButton.addEventListener(
      "click",
      () => {
        this._tl
          .to(this.domElement, {
            x: 1000,
          })
          .to(this.domElement, {
            display: "none",
          });
      },
      {
        once: true,
      }
    );

    this.domElement = document.createElement("div");
    Object.assign(this.domElement.style, {
      "font-family": "Raleway",
      width: "100%",
      height: "100%",
      margin: "0",
      padding: "0",
      overflow: "hidden",
      display: "flex",
      position: "absolute",
      "flex-direction": "column",
    });
    this.domElement.appendChild(this.textArea);
    this.domElement.appendChild(this.title);
    this.domElement.appendChild(this.exitButton);

    document.body.appendChild(this.domElement);
  }
}
