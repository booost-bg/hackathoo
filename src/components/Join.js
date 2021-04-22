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
    });

    const button = document.createElement('button');

    button.innerText = 'JOIN';

    Object.assign(button.style, {
      width: '204px',
      height: '48px',
      color: 'white',
      'background-color': 'black',
      cursor: 'pointer',
      border: 'none',
      'font-size': '24px',
    });

    button.addEventListener('click', () => {
      this.emit(Join.events.SUMBIT, { code: this.inputField.value });
    });

    this.body.appendChild(title);
    this.body.appendChild(this.inputField);
    this.body.appendChild(button);
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
        translateX: '-=5px',
      },
      duration: 0.01,
      repeat: 20,
      yoyo: true,
    });
  }
}
