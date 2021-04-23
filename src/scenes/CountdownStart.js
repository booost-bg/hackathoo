import CountdownBase from './CountdownBase';
import Timer from '../components/Timer';
import dayjs from 'dayjs';

/**
 * Represents the countdown before the hackathon ends.
 * @class
 */
export default class CountdownStart extends CountdownBase {
  async onCreated() {
    super.onCreated();
    this._createTimer();
  }
 
  /**
 * Renders the timer for the scene.
 * @method
 * @private
 */
  _createTimer() {
    this._startTime = dayjs();
    this._endTime = dayjs().add(3, 'hour');

    const timer = new Timer(this._startTime, this._endTime);
    timer.y = -75;
    this.timer = timer;
    this.addChild(this.timer);
    this._startProgressBar();
  }
}
