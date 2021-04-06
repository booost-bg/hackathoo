import { Container, Graphics } from "pixi.js";

export default class FireworkParticle extends Container {
  constructor() {
    super();
  }

  draw() {
    const circle = new Graphics();
    circle.drawCircle(60, 185, 40);
    this.addChild(circle);
  }
}
