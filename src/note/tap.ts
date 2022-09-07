import { Note } from './common_note';

export class Tap extends Note {
    lane: number;

    constructor(time: number, lane: number) {
        super(time);
        this.lane = lane;
    }

    toString() {
        return `(${Math.floor(this.time)},${this.lane});`;
    }

    mirror() {
        this.lane = 5 - this.lane;
        return this;
    }
}