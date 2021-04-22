import { EventEmitter } from 'events';

export default class Form extends EventEmitter {
  constructor(formConfig) {
    super();
    this.inputElements = {};
    this.config = formConfig;
    this.createFormElement();
  }

  /**
   * Creates a dom input element.
   * @param {string} element
   * @param {string} type
   * @param {string} text
   * @returns DOM element.
   * @method
   * @private
   */
  createInputElement(element, type, text, id, format) {
    const label = document.createElement('label');
    label.htmlFor = id;
    label.innerText = text;
    const input = document.createElement(element);
    input.id = id;
    if (element !== 'textarea') input.type = type;
    else {
      input.rows = '20';
    }
    if (format) {
      input.setAttribute('data-format', format);
    }

    Object.assign(label.style, {
      'font-family': 'Raleway',
      'font-weight': '600',
      'margin-top': '4px',
      color: 'white',
      'background-color': 'black',
      'box-sizing': 'border-box',
      display: 'inline-flex',
      padding: '10px',
    });

    Object.assign(input.style, {
      'box-sizing': 'border-box',
      width: '100%',
      resize: 'none',
      padding: '15px',
      'font-size': '16px',
      'min-height': '54px',
    });

    return { label, input };
  }

  /**
   * Creates dom form element.
   * @method
   * @private
   */
  createFormElement() {
    this.domElement = document.createElement('form');
    Object.assign(this.domElement.style, {
      'align-self': 'center',
      'justify-self': 'center',
      display: 'flex',
      'flex-direction': 'column',
      height: '550px',
      width: '420px',
      position: 'relative',
      top: this.config.vh,
      'justify-content': 'space-between',
      'box-sizing': 'border-box',
      'align-items': 'flex-start',
    });

    this.domElement.classList.add('setup-form');
    document.body.appendChild(this.domElement);
    this.config.inputs.forEach((input) => {
      const element = this.createInputElement(
        input.element,
        input.type,
        input.text,
        input.id,
        input.format
      );
      this.domElement.appendChild(element.label);
      this.domElement.appendChild(element.input);
      this.inputElements[element.input.id] = element.input;
    });
  }
}
