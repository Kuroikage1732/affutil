import { timeAlign, Note } from './common_note';
import { Tap } from './tap';

export class Hold extends Tap {
    totime: number;

    /**
     * @param time Note时间点
     * @param totime Note结束时间点
     * @param lane Note轨道，范围0~3
     */
    constructor(time: number, totime: number, lane: number) {
        super(time, lane);
        this.totime = Math.floor(totime);
    }

    /**
     * Note的持续时长
     */
    get length() {
        return Math.floor(this.totime - this.time);
    }

    /**
     * 将对象转换为字符串
     * @returns Note的Note语句形式字符串
     */
    toString() {
        return `hold(${Math.floor(this.time)},${Math.floor(this.totime)},${this._lane});`;
    }

    moveto(dest: number) {
        const originTime = this.time;
        super.moveto(dest);
        this.totime += this.time - originTime;
        return this;
    }

    /**
     * 返回移动到某个时间点Note对象的深拷贝
     * @param dest 偏移到的时间点
     * @returns 偏移后Note的深拷贝
     */
    cloneto(dest: number): Note {
        const alterthis = this.clone();
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