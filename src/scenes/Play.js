import Scene from './Scene';
import Footer from '../components/Footer';
import Progressbar from '../components/Progressbar';
import Bg from '../components/Background';
// import Button from '../components/Button';

export default class Play extends Scene {
  async onCreated() {
    this.background = new Bg({
      bgColor1: '#0C59EB',
      bgColor2: '#0C59EB',
      circleColor1: '#FFE600',
      circleColor2: '#FFE600',
    });

    const footer = new Footer();

    footer.x = -window.innerWidth / 2;
    footer.y = window.innerHeight / 2 - footer.height;
    // this.addChild(footer);

    const pg = new Progressbar({ initialWidth: 400 });
    // pg.height = window.innerHeight;
    pg.y = -window.innerHeight / 2;
    pg.x = -window.innerWidth / 2;
    // pg.width = window.innerWidth;
    // pg.height = window.innerHeight;
    this.background.addChild(pg);
    this.addChild(this.background);
    const obj1 = this.background.children[1];
    const obj2 = this.background.children[7];
    this.background.swapChildren(obj1, obj2);
    // this.pg = pg;
    // this.addChild(pg);
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    // eslint-disable-line no-unused-vars
    // const ratio = width / (1920 * 2);
    // console.log(width, height, ratio, 'ot play');
    // this.pg.resize(ratio);
    // if (ratio < 0.1) return;
    // this.scale.set(ratio);
  }
}
