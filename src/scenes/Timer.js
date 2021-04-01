import Scene from "./Scene";
import { pad } from "../core/utils";

export default class Timer extends Scene {
  constructor() {
    super();
  }

  async onCreated() {
    this.createCountdownTimer();
  }

  getDates() {
    const settings = JSON.parse(localStorage.getItem("hackathonSettings"));
    const startDate = this.parseHtmlDateTime(settings.startTime);
    const endDate = this.parseHtmlDateTime(settings.endTime);
    return { startDate, endDate };
  }

  parseHtmlDateTime(dateTime) {
    const dateArr = dateTime.replace(/T|:/g, "-").split("-");
    dateArr[1] = pad(dateArr[1] - 1);
    const date = new Date(...dateArr);
    return date;
  }

  createCountdownTimer() {
    const { startDate, endDate } = this.getDates();
    let startDateTime = startDate.getTime();
    const endDateTime = endDate.getTime();
    const timer = setInterval(() => {
      let distance = endDateTime - startDateTime;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      startDateTime += 1000;
      console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
    }, 1000);
  }
}
