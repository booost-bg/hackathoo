import { Container, Graphics, Text } from 'pixi.js';
import { gsap, Linear } from 'gsap';

export default class Notification extends Container {
  constructor(headerTextMessage = 'Important message', infoTextMessage = 'Don’t forget to push your code often!') {
    super();

    this.headerTextMessage = headerTextMessage;
    this.infoTextMessage = infoTextMessage;
    this.timeDuration = 5;

    this.baseHeight = 180;
    this.baseWidth = 870;

    this.yellowLineHeight = 180;
    this.yellowLineWidth = 12;

    this.horizontalTimerLineWidth = 0.1;
    this.horizontalTimerLineHeight = 13;

    this.init();

    this.notification.interactive = true;
    this.notification.buttonMode = true;
    this.notification.on('click', () => this._hideNotification());
    this._playEnterAnimation();
    this.startNotificationTimer(this.timeDuration);

  }

  /**
   * Initializes the Notification container,content and mask
   *
   * @memberof Notification
   */
  init() {
    this.notification = new Container();
    this.notification.x = - this.baseWidth;
    this.notificationMask = new Graphics();
    this.notificationMask.beginFill(0xFFFFFF, 1);
    this.notificationMask.drawRect(0, 0, this.baseWidth, this.baseHeight);

    const background = new Graphics();
    this.background = background;
    this.background.beginFill(0xFFFFFF, 1);
    this.background.drawRect(0, 0, this.baseWidth, this.baseHeight);
    this.notification.addChild(this.background);

    const yellowVerticalLine = new Graphics();
    this.yellowVerticalLine = yellowVerticalLine;
    this.yellowVerticalLine.beginFill(0xFFE500, 1);
    this.yellowVerticalLine.drawRect(0, 0, this.yellowLineWidth, this.yellowLineHeight);
    this.yellowVerticalLine.x = this.baseWidth - this.yellowLineWidth;
    this.notification.addChild(this.yellowVerticalLine);

    const horizontalTimerLine = new Graphics();
    this.horizontalTimerLine = horizontalTimerLine;
    this.horizontalTimerLine.beginFill(0x000000, 1);
    this.horizontalTimerLine.drawRect(0, 0, this.horizontalTimerLineWidth, this.horizontalTimerLineHeight);
    this.horizontalTimerLine.y = this.baseHeight - this.horizontalTimerLineHeight;
    this.notification.addChild(this.horizontalTimerLine);

    const headerText = new Text(this.headerTextMessage.toUpperCase(), {
      fontFamily: 'Raleway', fontSize: 24, fill: 0x0C53EB, fontWeight: 700, fontStyle: 'normal', 'line-height': '28px', 'letter-spacing': '0em'
    });
    this.headerText = headerText;
    this.headerText.x = 60;
    this.headerText.y = 52;
    this.notification.addChild(this.headerText);

    const infoText = new Text(this.infoTextMessage, {
      fontFamily: 'Raleway', fontSize: 36, fill: 0x000000, fontWeight: 400, fontStyle: 'normal', 'line-height': '42px', 'letter-spacing': '0em'
    });

    this.infoText = infoText;
    this.infoText.x = 60;
    this.infoText.y = 86;
    this.notification.addChild(this.infoText);

    this.addChild(this.notification);
    this.addChild(this.notificationMask);
    this.notification.mask = this.notificationMask;
  }

  startNotificationTimer(timerDuration) {
    gsap.to(this.horizontalTimerLine, { pixi: { width: this.baseWidth - this.yellowLineWidth }, duration: timerDuration, ease: Linear.easeNone }).then(() => {
      this._hideNotification();
    });
  }

  /**
   * Hides the notification 
   * 
   * @method
   * @private
   * @memberof Notification
   */
  _hideNotification() {
    gsap.to(this, { pixi: { alpha: 0 } });
    this.emit(Notification.events.NOTIFICATION_HIDDEN);
  }

  /**
   * Implements the entering animation of the Notification
   * 
   * @method
   * @private
   * @memberof Notification
   */
  _playEnterAnimation() {
    gsap.to(this.notification, { pixi: { x: 0 }, duration: 1 });
  }

  /**
   * Defines the events triggered by the Notification class
   *
   * @readonly
   * @static
   * @memberof Notification
   */
  static get events() {
    return {
      NOTIFICATION_HIDDEN: 'hidden_notification',
    };
  }
}