import Scene from "./Scene";
import { Sprite } from "pixi.js";
import Title from "../components/Title";
import Button from "../components/Button";
import Background from "../components/Background";
import FireworkParticle from "../components/FireworkParticle";

export default class Intro extends Scene {
  constructor() {
    super();
  }

  onCreated() {
    this.drawBackground();
    this.drawParticle();
  }

  drawBackground() {
    const background = new Background();
    this.addChild(background);
  }

  drawParticle() {
    const particle = new FireworkParticle();
    this.addChild(particle);
  }
}
