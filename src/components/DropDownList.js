import Server from './Server';
import config from '../config';
import gsap from 'gsap/all';

export default class DropDownList {
  /**
   * Creates an instance of DropDownList.
   * @param {String} teamRank - the unique identifier of each DropDown list
   * @param {Number} topPosition - the distance from the top on which the DropDown should be positioned
   * @memberof DropDownList
   */
  constructor(teamRank, topPosition) {
    this._teamRank = teamRank;
    this._topPosition = topPosition;
    this._leftDistanceFromBorder = 92;

    this._config = config;
    this.init();
  }

  /**
   * Initializes fetches the teams data from the API and creates the DropDownList DOM element
   * 
   * @method
   * @memberof DropDownList
   */
  async init() {
    await this._getTeamsData();
    this._createDropDownList(this._teamRank, this._topPosition);
  }

  /**
   * Fetches the Teams' data from the API
   * 
   * @method
   * @private
   * @memberof DropDownList
   */
  async _getTeamsData() {
    this.server = new Server(this._config.server);
    this.hackathonData = await this.server.status(74);
    this.participatingTeams = this.hackathonData.hackathonSettings.teams;
  };

  /**
   * Creates the DOM element of the DropDown list
   * 
   * @method
   * @private
   * @param {String} teamRank - the unique identifier of each DropDown list
   * @param {Number} topPosition - the distance from the top on which the DropDown should be positioned
   * @memberof DropDownList
   */
  _createDropDownList(teamRank, topPosition) {

    this.teamsDropDownList = document.createElement('select');
    this.teamsDropDownList.setAttribute('style', `position: absolute; left:${window.innerWidth + this._leftDistanceFromBorder}px; top: ${topPosition}`);
    this.teamsDropDownList.setAttribute('id', teamRank);
    this.teamsDropDownList.setAttribute('class', 'teamDropDownlist');

    document.body.appendChild(this.teamsDropDownList);

    const defaultOption = document.createElement('option');
    defaultOption.setAttribute('disabled', true);
    defaultOption.setAttribute('selected', true);
    defaultOption.setAttribute('value', true);
    defaultOption.text = ' -- Select a team -- ';
    document.getElementById(teamRank).add(defaultOption);

    this.participatingTeams.forEach((team, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.text = team;
      document.getElementById(teamRank).add(option);
    });
  }

  /**
   * Moves the DropDown list to left when opening the Control panel.
   * 
   * @method
   * @memberof DropDownList
   */
  moveLeft() {
    this.dropDownListElement = document.getElementById(this._teamRank);
    gsap.to(this.dropDownListElement, {
      x: -974
    });
  }

  /**
   * Moves the DropDown list to right when opening the Control panel.
   * 
   * @method
   * @memberof DropDownList
   */
  moveRight() {
    this.dropDownListElement = document.getElementById(this._teamRank);
    gsap.to(this.dropDownListElement, {
      x: 0
    });
  }
}