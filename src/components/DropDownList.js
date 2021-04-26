import config from '../config';

export default class DropDownList {
  /**
   * Creates an instance of DropDownList.
   * @param {String} teamRank - the unique identifier of each DropDown list
   * @param {Number} topPosition - the distance from the top on which the DropDown should be positioned
   * @param {Object} apiData - the current Hackathon data returned from the remote API
   * @param {Number} server - contains the configuration for accessing the remote API data
   * @memberof DropDownList
   */
  constructor(teamRank, topPosition, apiData, server) {
    this._teamRank = teamRank;
    this._topPosition = topPosition;
    this.apiData = apiData;
    this._server = server;

    this._leftDistanceFromBorder = 92;

    this._config = config;
    this.init();
  }

  /**
   * Initializes the teams data and creates the DropDownList DOM element
   * 
   * @method
   * @memberof DropDownList
   */
  async init() {
    this.participatingTeams = this.apiData.hackathonSettings.teams;
    this._createDropDownList(this._teamRank, this._topPosition);
  }

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
    this.teamsDropDownList.setAttribute('style', `position: absolute; top: ${topPosition}`);
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

    document.getElementById('winnersWrapper').appendChild(this.teamsDropDownList);
  }
}