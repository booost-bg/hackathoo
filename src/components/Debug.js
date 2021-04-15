import * as DAT from 'dat.gui';
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

    gui
      .add(sceneSelector, 'Select scene', dropDownListItems)
      .onChange((selectedValue) => {
        that.emit(Debug.events.SCENE_CHANGED, { scene: selectedValue });
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
      SCENE_CHANGED: 'scene_changed',
    };
  }
}
