import { sort } from '../sorter';
import { NoteGroup, Note } from './common_note';
import { Timing } from './timing';

export class AffList extends NoteGroup {
    offset: number;
    desnity: number;

    /**
     * @param notes Note容器
     * @param offset 控制AudioOffset
     * @param desnity 控制TimingPointDesnityFactor
     */
    constructor(notes: Note[] | NoteGroup = [], offset = 0, desnity = 1) {
        super(notes);
        this.offset = Math.floor(offset);
        this.desnity = Math.floor(desnity);
    }

    toString() {
        let tsdfstring = '';
        if(this.desnity != 1) {
            tsdfstring = 'TimingPointDensityFactor:';
            if(this.desnity - Math.floor(this.desnity) == 0) {
                tsdfstring += Math.floor(this.desnity).toString();
            } else {
                tsdfstring += this.desnity.toFixed(3);
            }
        }
        return [
            `AudioOffset:${Math.floor(this.offset)}`,
            tsdfstring == '' ? '-' : `${tsdfstring}\n-`,
            super.toString()
        ].join('\n');
    }

    offsetto(value: number): NoteGroup {
        let basebpm = 0;
        this.forEach((each) => {
            if(each instanceof Timing && each.time == 0) {
                basebpm = each.bpm;
            }
        });
        this.forEach((each, index) => {
            if(each) {
                this[index].offsetto(value);
            }
        });
        this.push(new Timing(0, basebpm, 4));
        return sort(this);
    }
}

export class TimingGroup extends NoteGroup {
    option: string;

    constructor(notes: Note[] | NoteGroup = [], opt = '') {
        super(notes);
        this.option = opt;
    }

    toString() {
        let group = `timinggroup(${this.option}){`;
        this.forEach((each) => {
            group += `\n${each.toString()}`;
        });
        group += '\n};';
        return group;
    }

    push(...objs: Array<Note>) {
        objs.forEach((obj: Note) => {
            super.push(obj);
        });
        return this.length;
    }

    offsetto(value: number): NoteGroup {
        let basebpm = 0;
        this.forEach((each) => {
            if(each instanceof Timing && each.time == 0) {
                basebpm = each.bpm;
            }
        });
        this.forEach((each, index) => {
            if(each) {
                this[index].offsetto(value);
            }
        });
        this.push(new Timing(0, basebpm, 4));
        return sort(this);
    }
}