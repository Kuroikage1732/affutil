import { Note } from './common_note';

export class Tap extends Note {
    _lane!: number;

    constructor(time: number, lane: number) {
        super(time);
        this.lane = lane;
    }

    set lane(lane: number) {
        if(lane == Math.floor(lane) && lane >= 0 && lane <= 5) {
            this._lane = lane;
        } else {
            throw `invalid value ${lane} for attribute "lane" (only accept 0~5)`;
        }
    }
    get lane() {
        return this._lane;
    }

    toString() {
        return `(${Math.floor(this.time)},${this._lane});`;
    }

    mirror() {
        this._lane = 5 - this._lane;
        return this;
    }
}