"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ws281x = require('rpi-ws281x-native'); // tslint:disable-line
class LightController {
    constructor(numLights) {
        this.lights = [];
        this.lightsFlashingTimer = null;
        this.lightsFlashingCounter = 0;
        this.numLights = numLights;
        this.setup();
    }
    setLights(lights) {
        this.lights = lights;
        this.updateLights();
    }
    teardown() {
        ws281x.reset();
    }
    startFlashingLights(color, delay = 1000) {
        this.lightsFlashingTimer = global.setInterval(() => {
            this.lightsFlashingCounter += 1;
            if (this.lightsFlashingCounter % 2 === 0) {
                this.setLights(_.times(this.numLights, index => ({ index, color })));
            }
            else {
                this.setLights([]);
            }
        }, delay);
    }
    stopFlashingLights() {
        if (this.lightsFlashingTimer) {
            global.clearInterval(this.lightsFlashingTimer);
        }
    }
    updateLights() {
        const pixelData = new Uint32Array(this.numLights);
        _.times(this.numLights, i => {
            const light = this.lights.find(({ index }) => index === i);
            if (light) {
                pixelData[i] = light.color;
            }
        });
        ws281x.render(pixelData);
    }
    setup() {
        ws281x.init(this.numLights);
    }
}
exports.LightController = LightController;
//# sourceMappingURL=LightController.js.map