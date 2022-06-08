import { cloneDeep } from 'lodash-es';

export function timeAlign(time: number, bpm: number, error = 3, lcm = 96): number {
    const fpb = 60000 * 4 / bpm / lcm;
    let alignedTime = 0;
    const atime1 = Math.round(Math.floor(time / fpb) * fpb); // 向下取grid时间戳
    const atime2 = Math.round(Math.ceil(time / fpb) * fpb); // 向上取grid时间戳
    const abs1 = Math.abs(time - atime1); // atime1与time的距离
    const abs2 = Math.abs(time - atime2);
    let ok1 = (abs1 <= error); //abs1是否在容差内
    const ok2 = (abs2 <= error);
    if(ok1 && ok2 && abs1 > abs2) {
        ok1 = false; // 哪个距离小就用哪个
    }
    if(ok1) {
        alignedTime = atime1;
    } else if(ok2) {
        alignedTime = atime2;
    } else {
        alignedTime = time;
    }
    return Math.floor(alignedTime);
}

export class Note {
    time: number;

    constructor(time: number) {
        this.time = Math.floor(time);
    }

    get type() {
        return this.constructor.name;
    }

    moveto(dest: number): Note {
        this.time = Math.floor(dest);
        return this;
    }

    copy(): Note {
        return cloneDeep(this);
    }

    mirror(): Note {
        return this;
    }

    offsetto(value: number): Note {
        this.time = Math.floor(this.time + value);
        return this;
    }

    align(bpm: number, error = 3, lcm = 96): Note {
        this.time = timeAlign(this.time, bpm, error, lcm);
        return this;
    }
}

export class NoteGroup extends Array {
    constructor(notes:  Note[] | NoteGroup = []) {
        super();
        if(notes) {
            notes.forEach((value: Note) => {
                if(value instanceof Array && value.type != 'TimingGroup') {
                    this.concat(value);
                } else {
                    this.push(value);
                }
            });
        }
    }

    get type() {
        return this.constructor.name;
    }

    toString(): string {
        let str = '';
        this.forEach((value: Note | NoteGroup, index, arr: NoteGroup[]) => {
            if(value) {
                str += value.toString();
            }
            if(index < arr.length - 1) {
                str += '\n';
            }
        });
        return str;
    }

    push(...objs: Array<Note | NoteGroup>) {
        objs.forEach((obj) => {
            super.push(obj);
        });
        return this.length;
    }

    concat(...iterables: Array<Note[] | NoteGroup>) {
        iterables.forEach((iter) => {
            if(iter instanceof NoteGroup) {
                super.concat(iter);
            } else {
                iter.forEach((item) => {
                    this.push(item);
                });
            }
        });
        return this;
    }

    moveto(dest: number) {
        this.forEach((value, index) => {
            if(value) {
                this[index].moveto(dest);
            }
        });
        return this;
    }

    mirror() {
        this.forEach((value, index) => {
            if(value) {
                this[index].mirror();
            }
        });
        return this;
    }

    align(bpm: number, error = 3, lcm = 96) {
        this.forEach((value, index) => {
            if(value) {
                this[index].align(bpm, error, lcm);
            }
        });
        return this;
    }
}