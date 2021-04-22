import { EventEmitter } from 'events';
import gsap from 'gsap/gsap-core';

export default class Join extends EventEmitter {
  static get events() {
    return { SUMBIT: 'submit' };
  }

  constructor() {
    super();
    this._createComponent();
  }

  _createComponent() {
    this.body = document.createElement('div');

    Object.assign(this.body.style, {
      'box-shadow': '0px 2px 17px 0px rgba(0,0,0,0.75)',
      'background-color': 'white',
      'align-self': 'center',
      'justify-self': 'center',
      display: 'flex',
      'flex-direction': 'column',
      height: '260px',
      width: '500px',
      position: 'relative',
      top: '-65vh',
      'justify-content': 'space-around',
      'box-sizing': 'border-box',
      'align-items': 'center',
      opacity: '0',
    });

    const title = document.createElement('h1');

    title.innerText = 'Join by code';

    this.inputField = document.createElement('input');

    Object.assign(this.inputField.style, {
      height: '80px',
      width: '400px',
      border: 'none',
      background: 'rgba(196, 196, 196, 0.28)',
      'font-size': '72px',
      'text-align': 'center',
      'text-transform': 'uppercase',
    });

    this.button = document.createElement('button');

    this.button.innerText = 'JOIN';

    Object.assign(this.button.style, {
      width: '204px',
      height: '48px',
      color: 'white',
      'background-color': 'black',
      cursor: 'pointer',
      border: 'none',
      'font-size': '24px',
    });

    this.onClickBound = this.onClick.bind(this);
    this.button.addEventListener('click', this.onClickBound);

    this.body.appendChild(title);
    this.body.appendChild(this.inputField);
    this.body.appendChild(this.button);
  }

  onClick() {
    this.emit(Join.events.SUMBIT, { code: this.inputField.value.toUpperCase() });
  }

  /**
   * Removes the join dom element
   * @method
   * @public
   */
  remove() {
    console.log('hi');
    this.button.removeEventListener('click', this.onClickBound);
    this.body.remove();
  }

  /**
   * Handles invalid code input animation.
   * @method
   * @public
   */
  handleInvalidCode() {
    this.inputField.style.border = '3px solid red';
    gsap.to(this.body, {
      css: {
        translateX: '-=7px',
      },
      duration: 0.02,
      repeat: 10,
      yoyo: true,
    });
  }
}
