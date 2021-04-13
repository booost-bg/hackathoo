import gsap from 'gsap/gsap-core';
import { Text, Graphics, Container } from 'pixi.js';

/**
 * Represents the team name and place container
 */
export default class Team extends Container {
  /**
   * @param {Object} teamInfo
   */
  constructor(teamInfo = { name: 'TEAM NAME', place: '3' }) {
    super();

    this._teamInfo = teamInfo;

    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._addTeamPlace();
    this._addTeamName();
  }

  /**
   * Adds the team place digit
   * @private
   */
  _addTeamPlace() {
    this.place = new Container();

    const digit = new Text(this._teamInfo.place, {
      fontFamily: 'Raleway',
      fontSize: 600,
      fontWeight: 900,
      align: 'center',
      fill: '#FFFFFF',
    });

    digit.resolution = 2;
    digit.anchor.set(0.5);

    const ordinalText = new Text(this._getOrdinal(this._teamInfo.place), {
      fontFamily: 'Raleway',
      fontSize: 120,
      fontWeight: 900,
      fill: '#FFFFFF',
    });

    ordinalText.resolution = 2;
    ordinalText.position.y = -200;
    ordinalText.position.x = 160;

    this.place.position.y = -200;
    this.place.addChild(digit, ordinalText);

    this.addChild(this.place);
  }

  /**
   * Adds the name container
   * @private
   */
  _addTeamName() {
    this.name = new Container();

    const width = 1000;
    const height = 160;
    const rect = new Graphics();

    rect.beginFill(0x000000);
    rect.drawRect(-width / 2, -height / 2, width, height);

    const nameText = new Text(this._teamInfo.name, {
      fontFamily: 'Raleway',
      fontSize: 100,
      fontWeight: 900,
      fill: '#FFFFFF',
    });

    nameText.anchor.set(0.5);
    nameText.resolution = 2;

    this.name.addChild(rect, nameText);
    this.name.position.y = 300;

    this.addChild(this.name);
  }

  /**
   * Animates the team containers into view
   */
  enterAnimation() {
    gsap.from(this.name, {
      y: window.innerHeight,
      duration: 2,
      ease: 'back(1)'
    });

    return gsap.from(this.place, {
      y: -window.innerHeight,
      duration: 2,
      ease: 'elastic(0.5)',
    });
  }

  /**
   * Animation when the team leaves the scene
   */
  leaveAnimation() {
    return gsap.to(this, {
      pixi: {
        scale: 0,
      },
      duration: 0.2,
    });
  }

  /**
   * Gets the ordinal suffix of a number
   * @private
   * @param {(String|Number)} number 
   * @returns suffix string
   */
  _getOrdinal(number) {
    const int = parseInt(number, 10);
    const s = ['TH', 'ST', 'ND', 'RD'];
    const v = int % 100;

    return (s[(v - 20) % 10] || s[v] || s[0]);
  }
}