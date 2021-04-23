import Scene from './Scene';
import config from '../config';
import Button from '../components/Button';
import Form from '../components/Form';
import gsap from 'gsap';

/**
 * Represents the setup scene of the app.
 */
export default class Setup extends Scene {
  static get events() {
    return { SUBMIT: 'submit', CHANGE_COLOR: 'change-color' };
  }

  constructor() {
    super();
    this.forms = [];
    this.formsConfig = config.scenes.Setup.forms;
    this.currentFormIndex = 0;
  }

  async onCreated() {
    this.drawButton();
    this.createForm();
    this.colorInputListener();
  }

  /**
   * Creates a form.
   * @method
   * @private
   */
  createForm() {
    if (this.form) this.form.domElement.style.display = 'none';
    this.form = new Form(this.formsConfig[this.currentFormIndex]);
    this._fadeIn();
    this.forms = [...this.forms, this.form];
  }

  /**
   * Form fade in animation
   * @private
   */
  _fadeIn() {
    gsap.to(this.form.domElement, {
      css: {
        opacity: 1,
      },
      duration: 0.9,
    });
  }

  /**
   * @returns {Object} Hakcathon's settings data.
   */
  get submittedSettings() {
    let settingsObject = {};
    this.forms.forEach((form) => {
      for (let setting in form.inputElements) {
        const input = form.inputElements[setting];

        switch (input.getAttribute('data-format')) {
          case 'list':
            settingsObject[setting] = input.value
              .split(',')
              .map((x) => x.trim());
            break;
          default:
            settingsObject[setting] = input.value;
        }
      }
    });
    return settingsObject;
  }

  /**
   * Draws the continue button for the scene switch.
   * @method
   * @private
   */
  drawButton() {
    const buttonConfig = {
      text: 'CONTINUE',
      fontSize: 24,
      width: 367,
      height: 53,
      curveSize: 13,
      y: 375,
    };
    this.button = new Button(buttonConfig);
    this.button.pivot.x = buttonConfig.width / 2;
    this.button.pivot.y = buttonConfig.height / 2;
    this.button.y += buttonConfig.y;
    this.addChild(this.button);
    this.button.on('click', () => this.buttonClickHandler());
  }

  /**
   * Handles Continue button click.
   * @method
   * @private
   */
  buttonClickHandler() {
    if (this.currentFormIndex >= this.formsConfig.length - 1) {
      localStorage.setItem(
        'hackathonSettings',
        JSON.stringify(this.submittedSettings)
      );
      this.finishScene();
    } else {
      this.currentFormIndex++;
      this.createForm();
    }
  }

  /**
   * Emits an event.
   * @method
   * @private
   */
  async finishScene() {
    this.button.startLoading();

    this.emit(Setup.events.SUBMIT, {
      hackathonSettings: this.submittedSettings,
    });
  }

  /**
   * Form fade out animation
   * @public
   */
  async fadeOut() {
    await gsap.to('form', {
      css: {
        opacity: 0,
        scale: 0.9,
      },
      duration: 0.9,
      onComplete: () => {
        this._clearDom();
      },
    });
  }

  /**
   * Remove dom elements
   * @private
   */
  async _clearDom() {
    this.forms.forEach((form) => {
      form.domElement.remove();
    });
  }

  /**
   * Changes the color of the background and fx dynamically on input change.
   * @method
   * @private
   */
  colorInputListener() {
    const colorInputs = this.forms[0].inputElements;
    const colorsForm = document.querySelector('form');

    colorsForm.addEventListener('change', () => {
      this.emit(Setup.events.CHANGE_COLOR, {
        bgColor1: colorInputs.mainColor.value,
        bgColor2: colorInputs.accentColor.value,
        circleColor1: colorInputs.fx1Color.value,
        circleColor2: colorInputs.fx2Color.value,
      });
    });
  }
}
