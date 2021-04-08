import { gsap } from 'gsap';
import { Container } from 'pixi.js';
import Notification from './Notification';

export default class NotificationManager extends Container {
  constructor() {
    super();
    this.notificationList = [];

    this.init();
  }

  init() {
    this.addNotification('Hey hey hey', 'info message');
    setTimeout(() => {
      this.addNotification('test one', 'this is text');
    }, 5000);
    setTimeout(() => {
      this.addNotification('test two', 'this is text');
    }, 1000);
    setTimeout(() => {
      this.addNotification('test three', 'this is text');
    }, 2000);
    setTimeout(() => {
      this.addNotification('test four', 'this is text');
    }, 2500);

  }

  /**
   * Initializes a new instance of Notification and adds it to the notificationList array
   *
   * @param {String} headerTextMessage - Defines the text that will appear in the notification header
   * @param {String} infoTextMessage - Defines the text that will appear below the header text
   * @methods
   * @memberof NotificationManager
   */
  addNotification(headerTextMessage, infoTextMessage) {
    const that = this;
    const notificationToAdd = new Notification(headerTextMessage, infoTextMessage);
    notificationToAdd.on('hidden_notification', () => {
      const elementToRemoveIndex = this.notificationList.indexOf(notificationToAdd);
      this.notificationList.splice(elementToRemoveIndex, 1);
      that.moveNotificationsUp();
    });
    this.notificationList.push(notificationToAdd);
    this.displayNotifications();
  }

  /**
   * Renders the notifications on the screen
   * 
   * @methods
   * @memberof NotificationManager
   */
  displayNotifications() {
    const that = this;
    this.notificationList.forEach((notification, index) => {
      notification.y = index * 200;
      that.addChild(notification);
    });
  }

  /**
   * Moves the visible notifications up when a given notification is hidden
   * 
   * @method
   * @memberof NotificationManager
   */
  moveNotificationsUp() {
    this.notificationList.forEach((notification) => {
      gsap.to(notification, { pixi: { y: notification.y - 200 } });
    });
  }

}