import { Container, Sprite, Graphics, Text } from 'pixi.js';
import Button from './Button';

/**
 * Represents the control panel.
 * @class
 */
export default class ControlPanelSidePanel extends Container {
  constructor() {
    super();

    this._buttonWidth = 801;
    this._buttonHeight = 53;
    this._leftDistanceFromBorder = 92;
    this._horizontalLineTopPosition = 518;

    this.init();
  }

  /**
   * Initializes the Control panel sidebar
   * 
   * @method
   * @memberof ControlPanelSidePanel
   */
  init() {
    this._createPanelBackground();
    this._createHeaderText();
    this._generateBreakButtons();
    this._createHorizontalLine();
    this._createCloseButton();
    this._generateUpdateButton();
    this._generateRankLabels();
  }

  /**
   * Initializes side panel's background
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _createPanelBackground() {
    const background = new Graphics();
    background.beginFill(0xFFFFFF);
    background.drawRect(0, 0, 974, window.innerHeight);
    background.y = - window.innerHeight / 2;
    background.endFill();

    this.addChild(background);
  }

  /**
   * Creates Sidebars' header
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _createHeaderText() {
    const headerText = new Text('Control Panel', {
      fontFamily: 'Raleway', fontSize: 72, fill: 0x000000, fontWeight: 700, fontStyle: 'normal', 'line-height': '84.5px', 'letter-spacing': '0em'
    });

    this.headerText = headerText;
    this.headerText.x = this._leftDistanceFromBorder;
    this.headerText.y = - window.innerHeight / 2 + 84;

    this.addChild(this.headerText);
  }

  /**
   * Initializes Sidebar's close button
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _createCloseButton() {
    const closeButton = new Graphics();
    closeButton.beginFill(0x000000);
    closeButton.drawRect(0, 0, 86, 84);
    closeButton.x = window.innerWidth / 2 - 72;
    closeButton.y = - window.innerHeight / 2;
    closeButton.endFill();
    closeButton.interactive = true;
    closeButton.buttonMode = true;
    closeButton.key = 'closeButton';

    const xSign = new Sprite.from('xSign');
    xSign.x = 31;
    xSign.y = 31;
    closeButton.addChild(xSign);

    closeButton.on('pointerdown', () => {
      this.emit(ControlPanelSidePanel.events.BUTTON_CLICKED, closeButton.key);
    });

    this.addChild(closeButton);
  }

  /**
   * Initializes the Break buttons
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _generateBreakButtons() {
    this._createButton('15 min break', 230, '15button', this._buttonWidth, this._buttonHeight);
    this._createButton('30 min break', 230 + this._buttonHeight + 15, '30button', this._buttonWidth, this._buttonHeight);
    this._createButton('60 min break', 230 + 2 * (this._buttonHeight + 15), '60button', this._buttonWidth, this._buttonHeight);
  }

  /**
   * initializes the Update button
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _generateUpdateButton() {
    this._createButton('UPDATE', 949, 'updateButton', 185, 55);
  }

  /**
   * Initilizes a single button. Used for the Beak button
   * 
   * @method
   * @private
   * @param {String} text - The text of the button
   * @param {Number} y - Button's vertical position
   * @param {String} key - The unique key that diferentiates the different buttons
   * @param {Number} btnWidth - The width of the button
   * @param {Number} btnHeight - The height of the button
   * @memberof ControlPanelSidePanel
   */
  _createButton(text, y, key, btnWidth, btnHeight) {
    const button = new Button({
      width: btnWidth,
      height: btnHeight,
      text,
    });

    button.key = key;
    button.x = this._leftDistanceFromBorder;
    button.y = button.y - window.innerHeight / 2 + y;
    button.on('pointerdown', () => {
      this.emit(ControlPanelSidePanel.events.BUTTON_CLICKED, button.key);
    });

    this.addChild(button);
  }

  /**
   * Initializes a horizontal line in the control panel
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _createHorizontalLine() {
    const horizonalLine = new Graphics();
    horizonalLine.beginFill(0xC4C4C4);
    horizonalLine.drawRect(0, 0, 974, 1);
    horizonalLine.y = - window.innerHeight / 2 + this._horizontalLineTopPosition;
    horizonalLine.endFill();

    this.addChild(horizonalLine);
  }

  /**
   * Initializes a single "Team position" label in the side panel. 
   *
   * @method
   * @private
   * @param {String} text - Defines the text of the label
   * @param {Number} top - Defines the vertical position of the label
   * @memberof ControlPanelSidePanel
   */
  _createRankLabel(text, top) {
    const rankLabel = new Text(text, {
      fontFamily: 'Raleway', fontSize: 16, fill: 0x000000, fontWeight: 400, fontStyle: 'normal', 'line-height': '19px', 'letter-spacing': '0em'
    });

    this.rankLabel = rankLabel;
    this.rankLabel.x = this._leftDistanceFromBorder;
    this.rankLabel.y = - window.innerHeight / 2 + top;

    this.addChild(this.rankLabel);
  }

  /**
   * Initializes all "Team position" labels in the control panel
   * 
   * @method
   * @private
   * @memberof ControlPanelSidePanel
   */
  _generateRankLabels() {
    this._createRankLabel('1st place', 605);
    this._createRankLabel('2nd place', 717);
    this._createRankLabel('3rd place', 829);
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
