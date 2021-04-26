import gsap from 'gsap/all';

/**
 * Represents the rules/criteria panel.
 * @class
 */
export default class Panel {
  /**
   * @constructor
   * @param {string} title
   * @param {string} content
   */
  constructor(title, content) {
    this._title = title;
    this._content = content;
    this._tl = gsap.timeline();
  }

  /**
   * Initializes the component.
   * @method
   * @public
   */
  init() {
    this._generateTitleElement();
    this._generateExitButton();
    this._generateTextArea();
    this._generateDomElement();
    this._animateIn();
  }

  /**
   * Animates the dom element in.
   * @method
   * @private
   */
  _animateIn() {
    this._tl.from(this.domElement, {
      x: 1000,
    });
  }

  /**
   * Animates the dom element out.
   * @method
   * @private
   */
  _animateOut() {
    this._tl
      .to(this.domElement, {
        x: 1000,
      })
      .to(this.domElement, {
        display: 'none',
      });
  }

  /**
   * Generates the title element of the panel.
   * @method
   * @private
   */
  _generateTitleElement() {
    this._titleElement = document.createElement('h1');

    Object.assign(this._titleElement.style, {
      display: 'flex',
      'flex-direction': 'column',
      'font-family': 'Raleway',
      'font-size': '60px',
      'font-weight': '800',
      position: 'absolute',
      'justify-content': 'space-between',
      'box-sizing': 'border-box',
      'align-items': 'flex-start',
      top: '50px',
      left: `1150px`,
      'z-index': '1',
    });

    if (this._title !== 'CONTROL') {
      this._titleElement.innerText = this._title;
    } else {
      this._titleElement.innerText = 'CONTROL PANEL';
    }
  }

  /**
   * Generates the text area element of the panel.
   * @method
   * @private
   */
  _generateTextArea() {
    this._textArea = document.createElement('textarea');
    this._textArea.readOnly = true;
    Object.assign(this._textArea.style, {
      outline: 'none',
      display: 'flex',
      'flex-direction': 'column',
      'font-family': 'Raleway',
      'font-size': '18px',
      padding: '68px',
      'padding-top': '180px',
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth / 2.3}px`,
      position: 'absolute',
      'justify-content': 'space-between',
      'box-sizing': 'border-box',
      'align-items': 'flex-start',
      left: `1085px`,
      'z-index': '0',
    });

    if (this._title !== 'CONTROL') {
      this._textArea.innerText = this._content;
    } else {
      this._textArea.innerText = '';
    }
  }

  /**
   * Generates the exit button of the panel.
   * @method
   * @private
   */
  _generateExitButton() {
    this._exitButton = document.createElement('button');

    Object.assign(this._exitButton.style, {
      outline: 'none',
      border: 'none',
      display: 'flex',
      'flex-direction': 'column',
      'font-family': 'Raleway',
      'font-size': '50px',
      'font-weight': '800',
      height: `70px`,
      width: `70px`,
      color: 'white',
      'background-color': 'black',
      position: 'absolute',
      'justify-content': 'center',
      'box-sizing': 'border-box',
      'align-items': 'center',
      left: `${window.innerWidth - 70}px`,
      cursor: 'pointer',
      'z-index': '1',
      'padding-bottom': '10px'
    });

    this._exitButton.innerHTML = 'x';

    this._exitButton.addEventListener(
      'click',
      () => this._animateOut(),
      {
        once: true,
      }
    );
  }

  /**
   * Generates the body of the panel.
   * @method
   * @private
   */
  _generateDomElement() {
    this.domElement = document.createElement('div');
    Object.assign(this.domElement.style, {
      'font-family': 'Raleway',
      width: '100%',
      height: '100%',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      display: 'flex',
      position: 'absolute',
      'flex-direction': 'column',
    });

    this.domElement.appendChild(this._textArea);
    this.domElement.appendChild(this._titleElement);
    this.domElement.appendChild(this._exitButton);

    document.body.appendChild(this.domElement);

    if (this._title === 'CONTROL') {
      this._initControlPanelElements();
    }
  }

  /**
   * Initizlies two sections inside the Panel. One for the "Break" buttons and one for the DropDownList with Winners 
   * 
   * @method
   * @private
   * @memberof Panel
   */
  _initControlPanelElements() {
    this._initBreakButtonsArea();
    this._initWinnerArea();
  }

  /**
   * Initializes the DOM element positioned between the title and the Winners' area in the Panel
   * 
   * @method
   * @private
   * @memberof Panel
   */
  _initBreakButtonsArea() {
    this._breakButtonsWrapper = document.createElement('div');

    Object.assign(this._breakButtonsWrapper.style, {
      position: 'absolute',
      left: '1085px',
      top: '180px',
      width: `${window.innerWidth / 2.3}px`,
      height: '338px',
      'border-bottom': '1px solid #C4C4C4',
      'z-index': 100,
    });

    this.domElement.appendChild(this._breakButtonsWrapper);
  }

  /**
   * Initializes the DOM element positioned below the Break buttons area in the Panel
   *
   * @method
   * @private
   * @memberof Panel
   */
  _initWinnerArea() {
    this._dropDownsWrapper = document.createElement('div');
    if (document.getElementById('winnersWrapper')) {
      document.getElementById('winnersWrapper').remove();
    }
    this._dropDownsWrapper.setAttribute('id', 'winnersWrapper');

    Object.assign(this._dropDownsWrapper.style, {
      position: 'absolute',
      left: '1085px',
      top: '518px',
      width: `${window.innerWidth / 2.3}px`,
      height: '615px',
      'z-index': 100,
    });

    this.domElement.appendChild(this._dropDownsWrapper);
  }

}
