import { Container } from 'pixi.js';
import gsap from 'gsap/all';
import DropDownList from './DropDownList';
import Panel from './Panel';
import Server from './Server';
import config from '../config';

export default class ControlPanel extends Container {
  /**
   * Creates an instance of ControlPanel.
   * @memberof ControlPanel
   */
  constructor(apiData) {
    super();

    this.apiData = apiData;
    this._config = config;

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
    this._createServer();
    this._initControlPanel();
    this._generateWinnersDropdowns();
    this._generateUpdateButton();
    this._generateRankLabels();
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
    const panel = new Panel('CONTROL', 'content');
    this.panel = panel;
    this.panel.init();
  }

  /**
   * Initializes event listeners for Control button and Control panel.
   * @method
   * @private
   */
  _eventListeners() {
    this.on(ControlPanel.events.BUTTON_CLICKED, (key) => {
      if (key === 'update') {
        this._submitWinners();
      }
    });
  }

  /**
   * Generates the Dropdown lists from which the Hackathon participants can be selected
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _generateWinnersDropdowns() {
    this._firstPlace = new DropDownList('first', '118px', this.apiData, this._server);
    this._secondPlace = new DropDownList('second', '230px', this.apiData, this._server);
    this._thirdPlace = new DropDownList('third', '342px', this.apiData, this._server);
  }

  /**
 * initializes the Update button
 * 
 * @method
 * @private
 * @memberof ControlPanel
 */
  _generateUpdateButton() {
    this._updateButton = document.createElement('button');
    this._updateButton.setAttribute('id', 'update');

    Object.assign(this._updateButton.style, {
      outline: 'none',
      border: 'none',
      'font-family': 'Raleway',
      'font-size': '16px',
      'font-weight': '700',
      height: `55px`,
      width: `185px`,
      color: 'white',
      'background-color': 'black',
      position: 'absolute',
      cursor: 'pointer',
      'z-index': '1',
      'text-transform': 'uppercase',
      'margin-left': '92px',
      top: '430px'
    });

    this._updateButton.innerHTML = 'Update';

    this._updateButton.addEventListener('pointerdown', (e) => {
      this.emit(ControlPanel.events.BUTTON_CLICKED, e.target.id);
    });

    document.getElementById('winnersWrapper').appendChild(this._updateButton);
  }

  /**
   * Initializes all labels that appear above the different DropDown lists in the Control panel 
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _generateRankLabels() {
    this._createRankLabel('1st place', 87);
    this._createRankLabel('2nd place', 199);
    this._createRankLabel('3rd place', 311);
  }

  /**
   * Initializes a single text label that is positioned above each DropDownList in the Control panel
   *
   * @method
   * @private
   * @param {Text} text - the text of the label
   * @param {Number} top - the top position of the label
   * @memberof ControlPanel
   */
  _createRankLabel(text, top) {
    this._rankLabel = document.createElement('span');

    Object.assign(this._rankLabel.style, {
      position: 'absolute',
      'margin-left': '92px',
      top: `${top}px`
    });

    this._rankLabel.innerHTML = text;
    document.getElementById('winnersWrapper').appendChild(this._rankLabel);
  }

  /**
   * Creates an instance of the Server class
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _createServer() {
    const server = new Server(this._config.server);

    this._server = server;
  }

  /**
   * Sumits the winners to the backend
   * 
   * @method
   * @private
   * @memberof ControlPanel
   */
  _submitWinners() {
    this._firstPlaceDropdown = document.getElementById('first');
    this._secondPlaceDropdown = document.getElementById('second');
    this._thirdPlaceDropdown = document.getElementById('third');

    const token = this._getToken();

    const team1Name = this._firstPlaceDropdown.options[this._firstPlaceDropdown.selectedIndex].text;
    const team2Name = this._secondPlaceDropdown.options[this._secondPlaceDropdown.selectedIndex].text;
    const team3Name = this._thirdPlaceDropdown.options[this._thirdPlaceDropdown.selectedIndex].text;

    const winners = [
      { name: team1Name, place: 1 },
      { name: team2Name, place: 2 },
      { name: team3Name, place: 3 },
    ];

    const query = `${this.apiData.code}?token=${token}`;

    this._server.update(query, { winners });
  }

  /**
   *  Returns the authentication token for the current Hackathon
   * 
   * @method
   * @priave
   * @return {String} - The authentication token needed to edit the backend data 
   * @memberof ControlPanel
   */
  _getToken() {
    if (this.apiData.token) {
      return this.apiData.token;
    }

    const localStorageToken = localStorage.getItem(this.apiData.code);

    if (localStorageToken) {
      return localStorageToken;
    }

    return '';
  }

  /**
 * Defines the events triggered by the class
 *
 * @readonly
 * @static
 * @memberof ControlPanelSidePanel
 */
  static get events() {
    return {
      BUTTON_CLICKED: 'button_clicked',
    };
  }
}
