import * as DAT from 'dat.gui';
import Setup from '../scenes/Setup';
import Intro from '../scenes/Intro';
import Splash from '../scenes/Splash';
import Topics from '../scenes/Topics';
import Countdown from '../scenes/Countdown';
import Play from '../scenes/Play';
// import CountdownStart from '../scenes/CountdownStart';
import EventEmitter from 'eventemitter3';

export default class Debug extends EventEmitter {
  constructor() {
    super();
    this.initGUI();
  }

  /**
 * Dev purposes only
 * Provides convenient scene changing approach for easier debuggin 
 * 
 * To add new scenes to the DropDownList of the dat.gui window 
 * 
 * @method 
 * @return {dat.GUI} 
 * @memberof Game
 */
  initGUI() {
    const that = this;
    const gui = new DAT.GUI();
    const sceneSelector = { 'Select scene': '' };

    // Definitions of the elements that will appear in the dat.gui DropDownList
    const dropDownListItems = {
      Intro: 'intro',
      Countdown: 'countdown',
      Play: 'play',
      Setup: 'setup',
      Splash: 'splash',
      Topics: 'topics',
      // CountdownStart: 'countdownStart'
    };

    // Scene name - Scene constructor pairs
    const scenes = {
      setup: Setup,
      intro: Intro,
      countdown: Countdown,
      play: Play,
      splash: Splash,
      topics: Topics,
      // countdownStart: CountdownStart
    };

    gui.add(sceneSelector, 'Select scene', dropDownListItems)
      .onChange((selectedValue) => {
        that.emit(Debug.events.SCENE_CHANGED, scenes[selectedValue], { scene: selectedValue });
      });
  }

  /**
   * Events that the Debug class can emit
   *
   * @readonly
   * @static
   * @memberof Debug
   */
  static get events() {
    return {
      SCENE_CHANGED: 'scene_changed'
    };
  }
}