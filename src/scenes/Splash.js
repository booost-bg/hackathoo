import Assets from '../core/AssetManager';
import Scene from './Scene';
import { Text, Loader } from 'pixi.js';
import config from '../config';

import gltfNumber0 from '../assets/0.gltf';
import gltfNumber1 from '../assets/1.gltf';
import gltfNumber2 from '../assets/2.gltf';
import gltfNumber3 from '../assets/3.gltf';
import gltfNumber4 from '../assets/4.gltf';
import gltfNumber5 from '../assets/5.gltf';
import gltfNumber6 from '../assets/6.gltf';
import gltfNumber7 from '../assets/7.gltf';
import gltfNumber8 from '../assets/8.gltf';
import gltfNumber9 from '../assets/9.gltf';
import gltfNumber10 from '../assets/10.gltf';
export default class Splash extends Scene {
  constructor() {
    super();

    this.loadingText = new Text('0%', {
      fontSize: 75,
      fill: 0xffc900,
    });

    this.config = config.scenes.Splash;

    this.loadingText.anchor.set(0.5);
    this.loadingText.x = this.width / 2;
    this.loadingText.y = this.height / 2;
    this.addChild(this.loadingText);
  }

  get finish() {
    return new Promise((res)=>setTimeout(res, this.config.hideDelay));
  }

  preload() {
    const images = {
      logo: Assets.images.logo,
      topicsMask: Assets.images.topicsMask,
      displacement: Assets.images.displacement,
    };
    const sounds = {
      
    };

    const modelsPromise = this._loadModels();

    return Promise.all([modelsPromise, super.preload({ images, sounds })]);
  }

  /**
   * Loads gltf models
   * @returns {Promise} Loader promise
   */
  _loadModels() {
    const loader = new Loader();

    loader.add('0', gltfNumber0);
    loader.add('1', gltfNumber1);
    loader.add('2', gltfNumber2);
    loader.add('3', gltfNumber3);
    loader.add('4', gltfNumber4);
    loader.add('5', gltfNumber5);
    loader.add('6', gltfNumber6);
    loader.add('7', gltfNumber7);
    loader.add('8', gltfNumber8);
    loader.add('9', gltfNumber9);
    loader.add('10', gltfNumber10);

    return new Promise((resolve) => {
      loader.load(() => {
        Assets.models = loader.resources;
        resolve();
      });
    });
  }

  onResize(width, height) { // eslint-disable-line no-unused-vars
    this.loadingText.x = width / 2;
    this.loadingText.y = (height / 2) + 500;
  }

  onLoadProgress(val) {
    this.loadingText.text = `${val}%`;
  }
}
