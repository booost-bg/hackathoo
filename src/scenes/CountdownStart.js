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
    this._currentTime = dayjs();

    this.timer = new Timer(this._currentTime, this._startTime);

    this.timer.on(Timer.events.TIMER_END, () => {
      this._finishScene();
    });

    this.timer.y = -75;
    this.addChild(this.timer);
    this._startProgressBar();
  }
}
