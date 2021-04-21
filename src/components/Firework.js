import { Container } from 'pixi.js';
import { random } from '../core/utils';
import FireworkParticle from './FireworkParticle';

export default class Firework extends Container {
    constructor() {
        super();

        this._addParticle();
    }


    static get events() {
        return {
            firework: 'NEW_FIREWORK',
            launched: 'LAUNCHED',
        }
    }

    /**
     * @private
     * creating particles 
     */
    _addParticle() {
        const particle = new FireworkParticle();
        const position = {
            x: random(window.innerWidth / 12, window.innerWidth / 2) * (Math.random() > 0.5 ? -1 : 1),
            y: random(-window.innerHeight / 4, window.innerHeight / 4),
        };

        particle.position.set(position.x, position.y);
        this.addChild(particle);

        particle.on(Firework.events.launched, (_y) => {
            this.emit(Firework.events.firework, { x: particle.position.x, y: _y });
        })

        setTimeout(() => {
            this._addParticle()
        }, random(1200, 1500));
    }
}
