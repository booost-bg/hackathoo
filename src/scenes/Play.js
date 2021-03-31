import { Sprite } from 'pixi.js';
import Scene from './Scene';
import gsap from 'gsap';
import Footer from '../components/Footer';
import Background from '../components/Background';

export default class Play extends Scene {
  async onCreated() {
    const background = new Background();
    this.addChild(background);
    
    // setTimeout(() => {
    //   background.changeColors('#FEE440', '#F15BB5', '#00BBF9', '#9B5DE5');
    // }, 1000);
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
