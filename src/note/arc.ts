import { Hold } from './hold';
import { cloneDeep } from 'lodash-es';
import validstrings from './validstrings';
import { timeAlign } from './common_note';
import { EasingFunc, slicer } from '../easing/index';

export class Arc extends Hold {
    fromx: number;
    fromy: number;
    tox: number;
    toy: number;
    _slideeasing!: string | EasingFunc | [EasingFunc, EasingFunc];
    _color!: number;
    isskyline: boolean;
    _skynote!: number[];
    _fx!: string;


    constructor(
        time: number,
        totime: number,
        fromx: number,
        tox: number,
        slideeasing: string,
        fromy: number,
        toy: number,
        color: number,
        isskyline: boolean,
        skynote: number[] = [],
        fx = 'none'
    ) {
        super(time, totime, 1);
        this.fromx = fromx;
        this.fromy = fromy;
        this.tox = tox;
        this.toy = toy;
        this.slideeasing = slideeasing;
        this.color = color;
        this.isskyline = isskyline;
        this.skynote = skynote;
        this.fx = fx;
    }

    set skynote(times) {
        if (times) {
            this._skynote = cloneDeep(times);
            this._skynote.sort();
        }
    }
    get skynote() {
        return this._skynote;
    }

    set color(value) {
        if (value >= 0) {
            this._color = value;
        } else {
            throw `invalid value ${value} for attribute "color" (only accept >=0)`;
        }
    }
    get color() {
        return this._color;
    }

    set slideeasing(easingtype) {
        if(easingtype instanceof Array) {
            const valid = ['b', 's', 'si', 'so'];
            for (let i = 0; i < 2; i++) {
                if(easingtype[i] instanceof Function) {
                    break;
                } else {
                    const et: any = easingtype[i];
                    if(valid.indexOf(et) == -1) {
                        throw `invalid value ${easingtype[i]} for attribute "slideeasing" (only accept ${valid})`;
                    }
                }
            }
        } else if(!(easingtype instanceof Function)) {
            if (validstrings.slideeasinglist.indexOf(easingtype) == -1) {
                throw `invalid value ${easingtype} for attribute "slideeasing" (only accept ${validstrings.slideeasinglist})`;
            }
        }
        this._slideeasing = easingtype;
    }
    get slideeasing() {
        return this._slideeasing;
    }

    set fx(value) {
        if (value != 'none') {
            if (validstrings.fxlist.indexOf(value) == -1) {
                throw `invalid value ${value} for attribute "fx" (only accept ${validstrings.fxlist})`;
            }
        }
        this._fx = value;
    }
    get fx() {
        return this._fx;
    }

    __geteasingtype(): [string, string] | [EasingFunc, EasingFunc] {
        const se = this.slideeasing;
        let x_type: any;
        let y_type: any;
        if(se instanceof Function) {
            x_type = se;
            y_type = se;
        } else if(se instanceof Array) {
            x_type = se[0];
            y_type = se[1];
        } else {
            x_type = 's';
            y_type = 's';
            
            if(se.length < 3 && ['bb', 'bs', 'sb', 'ss'].indexOf(se) == -1) {
                x_type = se;
                if(se == 'b') {
                    y_type = 'b';
                }
            } else {
                if(se.startsWith('b')) {
                    x_type = 'b';
                } else if(se.startsWith('si')) {
                    x_type = 'si';
                } else if(se.startsWith('so')) {
                    x_type = 'so';
                }

                if(se.endsWith('b')) {
                    y_type = 'b';
                } else if(se.endsWith('si')) {
                    y_type = 'si';
                } else if(se.endsWith('so')) {
                    y_type = 'so';
                }
            }
        }
        return [x_type, y_type];
    }

    get(item: number): [number, number] {
        const easingtype = this.__geteasingtype();
        const slice_x = slicer(item, this.time, this.totime, this.fromx, this.tox, easingtype[0]);
        const slice_y = slicer(item, this.time, this.totime, this.fromy, this.toy, easingtype[1]);
        return [slice_x, slice_y];
    }

    toString() {
        const arcstr = `arc(${this.time},${this.totime},${this.fromx.toFixed(2)},${this.tox.toFixed(2)},${this._slideeasing},${this.fromy.toFixed(2)},${this.toy.toFixed(2)},${this._color},${this._fx},${this.isskyline})`;
        let skynotestr = '';
        if (this._skynote.length > 0) {
            for (let index = 0; index < this._skynote.length; index++) {
                const time = this._skynote[index];
                skynotestr += `arctap(${time})`;
                if (index != this._skynote.length - 1) {
                    skynotestr += ',';
                }
            }
        }
        return arcstr + ((skynotestr == '') ? '' : `[${skynotestr}]`) + ';';
    }

    moveto(dest: number) {
        const offset = dest - this.time;
        for (let index = 0; index < this._skynote.length; index++) {
            this._skynote[index] += offset;
        }
        return this;
    }

    mirror() {
        this.fromx = 1 - this.fromx;
        this.tox = 1 - this.tox;
        return this;
    }

    vmirror() {
        this.fromy = 1 - this.fromy;
        this.toy = 1 - this.toy;
        return this;
    }

    offsetto(value: number) {
        super.offsetto(value);
        if (this._skynote) {
            this._skynote.forEach((v, index) => {
                this._skynote[index] += value;
            });
        }
        return this;
    }

    align(bpm: number, error = 3, lcm = 96) {
        super.align(bpm, error, lcm);
        if (this._skynote) {
            this._skynote.forEach((value, index) => {
                this._skynote[index] = timeAlign(value, bpm, error, lcm);
            });
        }
        return this;
    }

    transfer(xValue: number, yValue: number) {
        this.fromx += xValue;
        this.tox += xValue;
        this.fromy += yValue;
        this.toy += yValue;
        return this;
    }
}
