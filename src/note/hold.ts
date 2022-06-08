import { timeAlign, Note } from './common_note';
import { Tap } from './tap';

export class Hold extends Tap {
    totime: number;

    constructor(time: number, totime: number, lane: number) {
        super(time, lane);
        this.totime = Math.floor(totime);
    }

    get length() {
        return Math.floor(this.totime - this.time);
    }

    toString() {
        return `hold(${Math.floor(this.time)},${Math.floor(this.totime)},${this._lane});`;
    }

    moveto(dest: number) {
        const time = this.time;
        super.moveto(dest);
        this.totime += this.time - time;
        return this;
    }

    copyto(dest: number): Note {
        const alterthis = this.copy();
        return alterthis.moveto(dest);
    }

    offsetto(value: number) {
        super.offsetto(value);
        this.totime += value;
        return this;
    }

    align(bpm: number, error = 3, lcm = 96) {
        super.align(bpm, error, lcm);
        this.totime = timeAlign(this.totime, bpm, error, lcm);
        if(this.time == this.totime) {
            this.totime += 1;
        }
        return this;
    }
}