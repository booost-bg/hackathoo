import { gsap } from 'gsap';
import { Container } from 'pixi.js';
import Notification from './Notification';

export default class NotificationManager extends Container {
  constructor() {
    super();
    this.notificationList = [];
    this.margin = 15;

    this.init();
  }

  init() {
    this.addNotification('Hey hey hey', 'info message');
    this.displayNotifications();
    setTimeout(() => {
      this.addNotification('test one', 'this is text');
      this.displayNotifications();
    }, 3000);
    setTimeout(() => {
      this.addNotification('test two', 'this is text');
      this.displayNotifications();
    }, 1000);
    setTimeout(() => {
      this.addNotification('test three', 'this is text');
      this.displayNotifications();
    }, 2000);
    setTimeout(() => {
      this.addNotification('test four', 'this is text');
      this.displayNotifications();
    }, 2500);

  }

  /**
   * Initializes a new instance of Notification and adds it to the notificationList array
   *
   * @param {String} title - Defines the text that will appear in the notification header
   * @param {String} description - Defines the text that will appear below the header text
   * @methods
   * @memberof NotificationManager
   */
  addNotification(title, description) {
    const notificationToAdd = new Notification(title, description);

    notificationToAdd.on(Notification.events.NOTIFICATION_HIDDEN, () => {
      const elementToRemoveIndex = this.notificationList.indexOf(notificationToAdd);
      this.notificationList.splice(elementToRemoveIndex, 1);
      this.moveNotificationsUp();
    });
    this.notificationList.push(notificationToAdd);
  }

  /**
   * Renders the notifications on the screen
   * 
   * @methods
   * @memberof NotificationManager
   */
  displayNotifications() {
    this.notificationList.forEach((notification, index) => {
      notification.y = index * (notification.height + this.margin);
      this.addChild(notification);
    });
  }

  /**
   * Moves the visible notifications up when a given notification is hidden
   * 
   * @method
   * @memberof NotificationManager
   */
  moveNotificationsUp() {
    this.notificationList.forEach((notification, index) => {
      gsap.to(notification, { pixi: { y: index * (notification.height + this.margin) } });
    });
  }

}