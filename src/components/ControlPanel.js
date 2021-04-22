import { Container } from 'pixi.js';
import Button from './Button';
import gsap from 'gsap/all';
import ControlPanelSidePanel from './ControlPanelSidePanel';
import DropDownList from './DropDownList';

export default class ControlPanel extends Container {
  /**
   * Creates an instance of ControlPanel.
   * @memberof ControlPanel
   */
  constructor() {
    super();

    this.panelOpenPostion = window.innerWidth / 2;
    this._tl = gsap.timeline();

    this.init();
  }

  /**
   * Makes the initial initializataions when the Control Panel is created
   * 
   * @method
   * @memberof ControlPanel
   */
  init() {
    this._generateWinnersDropdowns();
    this._drawButtons();
    this._initControlPanel();
    this._eventListeners();
  }

  /**
   * Initializes the Control panel
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _initControlPanel() {
    const panel = new ControlPanelSidePanel();
    this.panelOpened = false;
    this.panel = panel;
    this.panel.x = window.innerWidth / 2;
    this.addChild(this.panel);
  }

  /**
   * Initializes event listeners for Control button and Control panel.
   * @method
   * @private
   */
  _eventListeners() {
    this.controlButton.on('click', () => {
      if (!this.panelOpened) {
        this._handleControlPanelAnimation(-1);
      }
    });

    this.panel.on(ControlPanelSidePanel.events.BUTTON_CLICKED, (key) => {
      if (key === 'closeButton' && this.panelOpened) {
        this._handleControlPanelAnimation(1);
      } else if (key === 'updateButton') {
        this._submitWinners();
      } else if (key === '15button') {
        this._setTimeBreak(15);
      } else if (key === '30button') {
        this._setTimeBreak(30);
      } else if (key === '60button') {
        this._setTimeBreak(60);
      }
    });
  }

  /**
   * Handles the "opening" and "closing" animations of the control panel.
   * 
   * @param {number} direction - defines the direction to which the panel should be moved
   * @method
   * @private
   */
  _handleControlPanelAnimation(direction) {
    this.panelOpened = !this.panelOpened;

    gsap.to(this.panel, {
      pixi: {
        x: this.panel.x + (974 * direction)
      }
    });

    if (direction === 1) {
      this._firstPlace.moveRight();
      this._secondPlace.moveRight();
      this._thirdPlace.moveRight();

    } else {
      this._firstPlace.moveLeft();
      this._secondPlace.moveLeft();
      this._thirdPlace.moveLeft();
    }
  }

  /**
   * Draws the Control button that opens the Control panel.
   * @method
   * @private
   */
  _drawButtons() {
    this.controlButton = new Button({
      text: 'CONTROL',
      fontSize: 18,
      width: 172,
      height: 55,
      curveSize: 14,
    });

    this.controlButton.pivot.x = window.innerWidth / 2 - 100;
    this.controlButton.y = window.innerHeight / 2 - 258;

    this.addChild(this.controlButton);
  }

  /**
   * Generates the Dropdown lists from which the Hackathon participants can be selected
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _generateWinnersDropdowns() {
    this._firstPlace = new DropDownList('first', '636px');
    this._secondPlace = new DropDownList('second', '748px');
    this._thirdPlace = new DropDownList('third', '860px');
  }

  /**
   * Makes a request to the backend with the Hackathon break time
   * 
   * @method
   * @private
   * @param {*} breakPeriod - the period of the break
   * @memberof ControlPanel
   */
  _setTimeBreak(breakPeriod) {
    console.log('Break period: ', breakPeriod);
    // submit a POST request with the break period
  }

  /**
   * Sumits the winners to the backend
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _submitWinners() {
    // submit a POST request with the winners of the Hackathon
    this._firstPlaceDropdown = document.getElementById('first');
    this._secondPlaceDropdown = document.getElementById('second');
    this._thirdPlaceDropdown = document.getElementById('third');

    console.log(this._firstPlaceDropdown.value);
    console.log(this._firstPlaceDropdown.options[this._firstPlaceDropdown.selectedIndex].text);

    console.log(this._secondPlaceDropdown.value);
    console.log(this._secondPlaceDropdown.options[this._secondPlaceDropdown.selectedIndex].text);

    console.log(this._thirdPlaceDropdown.value);
    console.log(this._thirdPlaceDropdown.options[this._thirdPlaceDropdown.selectedIndex].text);
  }
}
