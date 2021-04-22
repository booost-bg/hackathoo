export default class Join {
  constructor() {
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
    });

    const title = document.createElement('h1');

    title.innerText = 'Join by code';

    const inputField = document.createElement('input');

    Object.assign(inputField.style, {
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

    this.body.appendChild(title);
    this.body.appendChild(inputField);
    this.body.appendChild(button);
  }
}