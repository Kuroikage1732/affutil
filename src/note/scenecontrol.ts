import { Note } from './common_note';
import validstrings from './validstrings';

export class SceneControl extends Note {
    _scenetype!: string;
    x: number;
    y: number;

    constructor(time: number, scenetype: string, x = 0, y = 0) {
        super(time);
        this.scenetype = scenetype;
        this.x = x;
        this.y = y;
    }

    set scenetype(type) {
        if(validstrings.scenetypelist.indexOf(type) != -1) {
            this._scenetype = type;
        } else {
            throw `${type} is not a valid scene type`;
        }
    }
    get scenetype() {
        return this._scenetype;
    }

    toString() {
        if(['trackshow', 'trackhide'].indexOf(this._scenetype) != -1) {
            return `scenecontrol(${Math.floor(this.time)},${this._scenetype});`;
        } else if(['redline', 'arcahvdistort', 'arcahvdebris', 'hidegroup'].indexOf(this._scenetype) != -1) {
            return `scenecontrol(${Math.floor(this.time)},${this._scenetype},${this.x.toFixed(2)},${this.y});`;
        } else {
            throw `${this._scenetype} is not a valid scene type`;
        }
    }
}