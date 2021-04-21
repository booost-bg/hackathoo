import { Container } from 'pixi.js';
import gsap from 'gsap/all';
import Panel from './Panel';

export default class RulesCriteria extends Container {
  constructor() {
    super();

    this.rules = JSON.parse(localStorage.getItem('hackathonSettings')).rules;
    this.criteria = JSON.parse(
      localStorage.getItem('hackathonSettings')
    ).criteria;

    this._tl = gsap.timeline();

  }

  /**
   * Handles the "opening" animation of the dom element.
   * @param {string} title - The title of the opened panel
   * @param {string} key - holds information about the inforamtion that should be displayed - Rules or Criteria
   * @method
   * @private
   */
  _handleDomElementInAnimation(title, key) {
    const content = key === 'rulesCriteria' ? this.rules : this.criteria;

    const panel = new Panel(title, content);
    this._tl.from(panel.domElement, {
      x: 1000,
    });
  }

}
