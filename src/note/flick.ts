import { Note } from './common_note';

export class Flick extends Note {
    x: number;
    y: number;
    dx: number;
    dy: number;

    /**
     * @param time Note时间点
     */
    constructor(time: number, x: number, y: number, dx: number, dy: number) {
        super(time);
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    toString() {
        return `flick(${Math.floor(this.time)},${this.x.toFixed(2)},${this.y.toFixed(2)},${this.dx.toFixed(2)},${this.dy.toFixed(2)});`;
    }
}