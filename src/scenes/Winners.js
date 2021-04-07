import Scene from './Scene';
import Background from '../components/Background';
import Team from '../components/Team';
import gsap from 'gsap/gsap-core';

/**
 * Class representing the Topics scene
 */
export default class Winners extends Scene {
  /**
   * @param {Object[]} winners Winners array
   */
  constructor(winners = [
    { name: 'TEAM 1', place: '1' },
    { name: 'TEAM 3', place: '3' },
    { name: 'TEAM 2', place: '2' },
  ]) {
    super();
    
    this._winners = winners;

    this._config = {
      delay: 5,
    };
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
    background.changeColors({
      circleColor1: '#102AEB',
      circleColor2: '#102AEB',
      bgColor1: '#102AEB',
      bgColor2: '#102AEB',
    });

    this.addChild(background);
  }

  /**
   * Async delay
   * @param {Number} seconds seconds to delay
   * @returns {Promise}
   */
  delay(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }

  /**
   * Sorts the winner array by team place and starts the teams animation
   * @private
   */
  async _initTeams() {
    this._winners.sort((a, b) => parseInt(b.place, 10) - parseInt(a.place, 10));

    await this.delay(1);

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

      gsap.from(team.name, {
        y: window.innerHeight,
        duration: 2,
        ease: 'back(1)'
      });

      gsap.from(team.place, {
        y: -window.innerHeight,
        duration: 2,
        ease: 'elastic(0.5)'
      });

      // Don't continue if it's the first place team
      if (parseInt(teamInfo.place, 10) === 1) return;

      await this.delay(this._config.delay);

      await gsap.to(team, {
        pixi: {
          scale: 0,
        },
        duration: 0.2,
        onComplete: async () => { 
          this.removeChild(team); 
        }
      });
    }
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