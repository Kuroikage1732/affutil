import { Note } from './common_note';

export class Timing extends Note {
    bpm: number;
    bar: number;
    
    constructor(time: number, bpm: number, bar = 4) {
        super(time);
        this.bpm = bpm;
        this.bar = bar;
    }

    toString() {
        return `timing(${this.time},${this.bpm.toFixed(2)},${this.bar.toFixed(2)});`;
    }
}