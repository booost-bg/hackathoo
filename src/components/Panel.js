import gsap from "gsap/all";

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
    this._generateTitleElement();
    this._generateTextArea();
    this._generateExitButton();
    this._generateDomElement();
  }

  /**
   * Generates the title element of the panel.
   * @method
   * @private
   */
  _generateTitleElement() {
    this._titleElement = document.createElement("h1");

    Object.assign(this._titleElement.style, {
      display: "flex",
      "flex-direction": "column",
      "font-family": "Raleway",
      "font-size": "60px",
      "font-weight": "800",
      position: "absolute",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
      top: "50px",
      left: `1150px`,
      "z-index": "1",
    });

    this._titleElement.innerText = this._title;
  }

  /**
   * Generates the text area element of the panel.
   * @method
   * @private
   */
  _generateTextArea() {
    this._textArea = document.createElement("textarea");
    Object.assign(this._textArea.style, {
      outline: "none",
      display: "flex",
      "flex-direction": "column",
      "font-family": "Raleway",
      "font-size": "18px",
      padding: "68px",
      "padding-top": "180px",
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth / 2.3}px`,
      position: "absolute",
      "justify-content": "space-between",
      "box-sizing": "border-box",
      "align-items": "flex-start",
      left: `1085px`,
      "z-index": "0",
    });

    this._textArea.innerText = this._content;
  }

  /**
   * Generates the exit button of the panel.
   * @method
   * @private
   */
  _generateExitButton() {
    this._exitButton = document.createElement("button");

    Object.assign(this._exitButton.style, {
      outline: "none",
      border: "none",
      display: "flex",
      "flex-direction": "column",
      "font-family": "Raleway",
      "font-size": "50px",
      "font-weight": "800",
      height: `70px`,
      width: `70px`,
      color: "white",
      "background-color": "black",
      position: "absolute",
      "justify-content": "center",
      "box-sizing": "border-box",
      "align-items": "center",
      left: `${window.innerWidth - 70}px`,
      cursor: "pointer",
      "z-index": "1",
    });

    this._exitButton.innerHTML = "x";

    this._exitButton.addEventListener(
      "click",
      () => {
        this._tl
          .to(this.domElement, {
            x: 1000,
          })
          .to(this.domElement, {
            display: "none",
          });
      },
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
    this.domElement = document.createElement("div");
    Object.assign(this.domElement.style, {
      "font-family": "Raleway",
      width: "100%",
      height: "100%",
      margin: "0",
      padding: "0",
      overflow: "hidden",
      display: "flex",
      position: "absolute",
      "flex-direction": "column",
    });
    this.domElement.appendChild(this._textArea);
    this.domElement.appendChild(this._titleElement);
    this.domElement.appendChild(this._exitButton);

    document.body.appendChild(this.domElement);
  }
}
