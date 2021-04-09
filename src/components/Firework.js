import { Container, Graphics } from 'pixi.js';
import { random } from '../core/utils';
import FireworkParticle from './FireworkParticle';

export default class Firework extends Container {
    constructor() {
        super();

        this._addParticle();
    }

    _addParticle() {
        const particle = new FireworkParticle();
        const pos = {
            x: random(window.innerWidth / 12, window.innerWidth / 2) * (Math.random() > 0.5 ? -1 : 1),
            y: random(-window.innerHeight / 4, window.innerHeight / 4),
        };

        particle.position.set(pos.x, pos.y);
        this.addChild(particle);
        setTimeout(() => {
            this._addParticle()
        }, random(200, 500));
    }
}
