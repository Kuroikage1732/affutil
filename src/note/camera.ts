import { Note } from './common_note';
import validstrings from './validstrings';

export class Camera extends Note {
    transverse: number;
    bottomzoom: number;
    linezoom: number;
    steadyangle: number;
    topzoom: number;
    angle: number;
    _easing!: string;
    lastingtime: number;

    /**
     * @param time Note时间点
     */
    constructor(
        time: number,
        transverse: number,
        bottomzoom: number,
        linezoom: number,
        steadyangle: number,
        topzoom: number,
        angle: number,
        easing: string,
        lastingtime: number
    ) {
        super(time);
        this.transverse = transverse;
        this.bottomzoom = bottomzoom;
        this.linezoom = linezoom;
        this.steadyangle = steadyangle;
        this.topzoom = topzoom;
        this.angle = angle;
        this.easing = easing;
        this.lastingtime = Math.floor(lastingtime);
    }

    set easing(easingtype) {
        if (validstrings.cameraeasinglist.indexOf(easingtype) != -1) {
            this._easing = easingtype;
        } else {
            throw `invalid value ${easingtype} for attribute "easing" (only accept ${validstrings.cameraeasinglist})`;
        }
    }
    get easing() {
        return this._easing;
    }

    toString() {
        return `camera(${this.time},${this.transverse.toFixed(2)},${this.bottomzoom.toFixed(2)},${this.linezoom.toFixed(2)},${this.steadyangle.toFixed(2)},${this.topzoom.toFixed(2)},${this.angle.toFixed(2)},${this.easing},${this.lastingtime});`;
    }
}