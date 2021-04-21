import { Container } from "pixi.js";
import Button from "./Button";
import gsap from "gsap/all";
import Panel from "./Panel";

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
    const panel = new Panel(title, content);
    this._tl.from(panel.domElement, {
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
}
