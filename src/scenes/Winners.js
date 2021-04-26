import Scene from './Scene';
import Background from '../components/Background';
import Team from '../components/Team';
import gsap from 'gsap/gsap-core';
import { filters, Sprite } from 'pixi.js';
import { delay } from '../core/utils';
import config from '../config';

/**
 * Class representing the Topics scene
 */
export default class Winners extends Scene {
  /**
   * @param {Object[]} winners Winners array
   */
  constructor({winners}) {
    super();
    
    this._winners = winners;

    this._config = config.scenes.Winners;
  }

  async onCreated() {
    this._init();
  }

  /**
   * @private
   */
  _init() {
    this._addBackground();
    this._initTeams();
  }

  /**
 * Adds the background to the scene
 * @private
 */
  _addBackground() {
    const background = new Background();
    background.scale.set(1.1);
    background.changeColors({
      circleColor1: '#0085D1',
      circleColor2: '#0085D1',
      bgColor1: '#102AEB',
      bgColor2: '#102AEB',
    });

    this.addChild(background);
  }

  /**
   * Sorts the winner array by team place and starts the teams animation
   * @private
   */
  async _initTeams() {
    this._winners.sort((a, b) => parseInt(b.place, 10) - parseInt(a.place, 10));

    await delay(this._config.startDelay * 1000);

    this._startTeamVisualization();
  }

  /**
   * Starts the team countdown visualization
   * @private
   * @returns promise
   */
  async _startTeamVisualization() {
    for (const teamInfo of this._winners) {
      const team = new Team(teamInfo);

      this.addChild(team);

      setTimeout(() => {
        this._emitShockwave();
      }, 1000);

      team.enterAnimation();

      // Don't continue if it's the team in first place
      if (parseInt(teamInfo.place, 10) === 1) return;

      await delay(this._config.betweenTeamsDelay * 1000);

      await team.leaveAnimation();

      this.removeChild(team);
    }
  }

  /**
   * Shockwave effect emitted whenever a team is displayed
   * @private
   */
  async _emitShockwave() {
    const displacementSprite = new Sprite.from('displacement');
    const displacementFilter = new filters.DisplacementFilter(displacementSprite);
    const filterIntensity = 60;

    this.addChild(displacementSprite); 
    this.filters = [displacementFilter];

    displacementFilter.autoFit = false;
    displacementFilter.scale.set(filterIntensity);

    displacementSprite.anchor.set(0.5);
    displacementSprite.scale.set(0);

    // TODO: FIX DISPLACEMENT FILTER "DISPLACEMENT" ISSUE AND REMOVE THIS HACK
    this.position.x = -filterIntensity / 2;
    this.position.y = -filterIntensity / 2;

    await gsap.to(displacementSprite, {
      pixi: {
        scale: 10,
      },
      duration: this._config.shockwaveDuration,
    });
    
    this.removeChild(displacementSprite);
    this.filters = [];

    // TODO: REMOVE THIS AFTER THE ISSUE MENTIONED IN THE COMMENT ABOVE IS RESOLVED
    this.position.x = 0;
    this.position.y = 0;
  }
  
  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars

  }
}