import config from '../config';

/**
 * Initializes a new instance of MusicPlayer
 * @class
 */
export default class MusicPlayer {
  constructor() {
    /**
     * @type {Object}
     * @private
     */
    this._config = config.musicPlayer;
  }

  /**
   * Add spotify widget to page
   * @public
   */
  create() {
    const el = document.createElement('iframe');

    el.setAttribute('src', this._config.playlist);
    el.setAttribute('width', '300');
    el.setAttribute('height', '80');
    el.setAttribute('frameborder', '0');
    el.setAttribute('allowtransparency', 'true');
    el.setAttribute('allow', 'encrypted-media');
    el.setAttribute('color', 'red');
    el.setAttribute('class', 'player');
    Object.assign(el.style, {
      position: 'relative',
      top: '-15.5vh',
      left: '80vw',
    });

    document.body.appendChild(el);
  }
}
